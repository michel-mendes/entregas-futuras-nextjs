import { EntregaFuturaService } from '../entrega-futura.service';
import { EntregaFuturaRepository } from '../entrega-futura.repository';
import { StatusEntrega, IEntregaFutura } from '../entrega-futura.types';
import { AppError } from '@/lib/errors/AppError';
import { Types } from 'mongoose';
import { CreateEntregaFuturaDTO, CreateItemEntregaDTO } from '../entrega-futura.dto';

// Mockamos a camada de acesso a dados inteira. Não queremos I/O de banco rodando nos testes.
jest.mock('../entrega-futura.repository');

describe('EntregaFuturaService', () => {
    let service: EntregaFuturaService;
    let repositoryMock: jest.Mocked<EntregaFuturaRepository>;

    const mockEntregaId = new Types.ObjectId().toString();
    const mockProdutoId = new Types.ObjectId().toString();
    const mockItemId = new Types.ObjectId().toString();

    beforeEach(() => {
        jest.clearAllMocks();

        repositoryMock = new EntregaFuturaRepository() as jest.Mocked<EntregaFuturaRepository>;
        service = new EntregaFuturaService(repositoryMock);
    });

    describe('criarEntrega', () => {
        it('deve criar uma entrega com sucesso quando os dados forem válidos', async () => {

            // Arrange
            const dto: CreateEntregaFuturaDTO = {
                cliente: {
                    nome: 'João',
                    documento: '12345678901',
                    telefone: '11999999999'
                },
                enderecoEntrega: {
                    cep: '00000000',
                    logradouro: 'Rua A',
                    numero: '123',
                    bairro: 'Centro',
                    cidade: 'São Paulo',
                    uf: 'SP'
                },
                itens: [{
                    produtoId: mockProdutoId,
                    descricao: 'Porcelanato X',
                    quantidadeComprada: 10
                }]
            };

            const mockRetornoBanco: Partial<IEntregaFutura> = {
                _id: new Types.ObjectId(mockEntregaId),
                ...dto,
                itens: [{ _id: new Types.ObjectId(mockItemId), ...dto.itens[0], produtoId: new Types.ObjectId(dto.itens[0].produtoId), quantidadeEntregue: 0 }],
                status: StatusEntrega.PENDENTE,
                dataCriacao: new Date(),
            };

            repositoryMock.criar.mockResolvedValue(mockRetornoBanco as any);

            // Act
            const resultado = await service.criarEntrega(dto);

            // Assert
            expect(repositoryMock.criar).toHaveBeenCalledTimes(1);
            expect(resultado.status).toBe(StatusEntrega.PENDENTE);
            expect(resultado.totalPecasCompradas).toBe(10);
            expect(resultado.progressoPercentual).toBe(0);
        });

        it('deve lançar erro (BadRequest) se a entrega não possuir itens', async () => {
            // Arrange
            const dtoInvalido = {
                cliente: { nome: 'João', documento: '12345678901', telefone: '11999999999' },
                enderecoEntrega: { cep: '00000000', logradouro: 'Rua', numero: '1', bairro: 'B', cidade: 'C', uf: 'SP' },
                itens: [] // Vazio propositalmente
            };

            // Act & Assert
            await expect(service.criarEntrega(dtoInvalido))
                .rejects
                .toThrow(AppError); // Valida se a sua classe de erro customizada interceptou

            expect(repositoryMock.criar).not.toHaveBeenCalled(); // Garante que não tentou salvar
        });
    });

    describe('registrarBaixaParcial', () => {
        let mockEntregaExistente: any;

        beforeEach(() => {
            // Estado inicial padrão para os testes de baixa
            mockEntregaExistente = {
                _id: mockEntregaId,
                status: StatusEntrega.PENDENTE,
                cliente: { nome: 'Maria' },
                enderecoEntrega: { logradouro: 'Rua B', numero: '1', bairro: 'B', cidade: 'C', uf: 'SP' },
                itens: [
                    {
                        _id: mockItemId,
                        produtoId: mockProdutoId,
                        descricaoSnapshot: 'Piso Y',
                        quantidadeComprada: 50,
                        quantidadeEntregue: 10 // Restam 40
                    }
                ]
            };
        });

        it('deve registrar baixa e mudar status para EM_ANDAMENTO se ainda restarem itens', async () => {
            // Arrange
            repositoryMock.buscarPorId.mockResolvedValue(mockEntregaExistente);

            const mockEntregaAtualizada = {
                ...mockEntregaExistente,
                status: StatusEntrega.PARCIAL,
                itens: [{ ...mockEntregaExistente.itens[0], quantidadeEntregue: 30 }] // Baixou +20, total 30. Restam 20.
            };
            repositoryMock.registrarBaixaItem.mockResolvedValue(mockEntregaAtualizada as any);

            // Act
            const resultado = await service.registrarBaixaParcial(mockEntregaId, {
                itemId: mockItemId,
                quantidadeEntregue: 20
            });

            // Assert
            expect(repositoryMock.registrarBaixaItem).toHaveBeenCalledWith(
                mockEntregaId,
                mockItemId,
                20,
                StatusEntrega.PARCIAL // Valida o cálculo do novo status
            );
            expect(resultado.status).toBe(StatusEntrega.PARCIAL);
            expect(resultado.progressoPercentual).toBe(60); // (30 / 50) * 100
        });

        it('deve registrar baixa e mudar status para CONCLUIDA se não restarem itens pendentes', async () => {
            // Arrange
            repositoryMock.buscarPorId.mockResolvedValue(mockEntregaExistente);

            const mockEntregaAtualizada = {
                ...mockEntregaExistente,
                status: StatusEntrega.CONCLUIDA,
                itens: [{ ...mockEntregaExistente.itens[0], quantidadeEntregue: 50 }] // Baixou +40, atingiu total.
            };
            repositoryMock.registrarBaixaItem.mockResolvedValue(mockEntregaAtualizada as any);

            // Act
            const resultado = await service.registrarBaixaParcial(mockEntregaId, {
                itemId: mockItemId,
                quantidadeEntregue: 40 // Baixando exatamente o que faltava
            });

            // Assert
            expect(repositoryMock.registrarBaixaItem).toHaveBeenCalledWith(
                mockEntregaId,
                mockItemId,
                40,
                StatusEntrega.CONCLUIDA // Valida a transição de status final
            );
            expect(resultado.status).toBe(StatusEntrega.CONCLUIDA);
            expect(resultado.progressoPercentual).toBe(100);
        });

        it('deve bloquear a baixa se a quantidade solicitada for maior que o saldo pendente', async () => {
            // Arrange
            repositoryMock.buscarPorId.mockResolvedValue(mockEntregaExistente);

            // Act & Assert
            // Faltam 40, tentando baixar 41. Deve falhar miseravelmente.
            await expect(service.registrarBaixaParcial(mockEntregaId, {
                itemId: mockItemId,
                quantidadeEntregue: 41
            })).rejects.toThrow(/excede o saldo pendente/);

            // Segurança: O repositório nunca deve ser chamado para alterar dados neste cenário
            expect(repositoryMock.registrarBaixaItem).not.toHaveBeenCalled();
        });

        it('deve bloquear a baixa se a entrega já estiver CONCLUIDA ou CANCELADA', async () => {
            // Arrange
            mockEntregaExistente.status = StatusEntrega.CONCLUIDA;
            repositoryMock.buscarPorId.mockResolvedValue(mockEntregaExistente);

            // Act & Assert
            await expect(service.registrarBaixaParcial(mockEntregaId, {
                itemId: mockItemId,
                quantidadeEntregue: 10
            })).rejects.toThrow(/Não é possível alterar uma entrega com status/);

            expect(repositoryMock.registrarBaixaItem).not.toHaveBeenCalled();
        });
    });
});