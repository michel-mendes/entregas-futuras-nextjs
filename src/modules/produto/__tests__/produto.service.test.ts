import { produtoService } from '@/modules/produto/produto.service';
import { produtoRepository } from '@/modules/produto/produto.repository';
import { CategoriaProduto, IProduto } from '@/modules/produto/produto.types';

// Mock do repositório de produtos
jest.mock('@/modules/produto/produto.repository');

describe('ProdutoService', () => {

    // Executa limpeza de todos os mocks antes de cada teste
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('criarProduto', () => {

        it('deve criar um produto com sucesso se o SKU não existir', async () => {
            // Dados do novo produto
            const codigoSKU = '7896675432'
            const input: IProduto = {
                codigoSKU,
                descricao: 'Porcelanato Acetinado',
                precoVista: 100,
                precoPrazo: 110,
                categoria: CategoriaProduto.PORCELANATO,
                pesoEmbalagemKg: 20,
                m2Embalagem: 2.5,
                ativo: true
            };

            // Simulamos que o banco NÃO encontrou o SKU (retorna null)
            (produtoRepository.findBySKU as jest.Mock).mockResolvedValue(null);

            // Simula que o produto foi criado com sucesso
            const produtoCriadoMock = { _id: 'mock-id-123', ...input, createdAt: new Date(), updatedAt: new Date() };
            (produtoRepository.create as jest.Mock).mockResolvedValue(produtoCriadoMock);

            const resultado = await produtoService.criarProduto(input);

            expect(produtoRepository.findBySKU).toHaveBeenCalledWith(codigoSKU);
            expect(produtoRepository.findBySKU).toHaveBeenCalledTimes(1);

            expect(produtoRepository.create).toHaveBeenCalledWith(input);
            expect(produtoRepository.create).toHaveBeenCalledTimes(1);

            expect(resultado).toEqual(produtoCriadoMock);
        });

        it('deve lançar um erro se tentar criar um produto com SKU já existente', async () => {
            // Dados do produto novo produtuo
            const codigoSKU = "SKU_DUPLICADO";
            const input: IProduto = {
                codigoSKU,
                descricao: 'Argamassa',
                precoVista: 20,
                precoPrazo: 22,
                categoria: CategoriaProduto.ARGAMASSA,
                ativo: true,
            };

            // Simula que o banco encontrou o produto que já contém o SKU em questão
            (produtoRepository.findBySKU as jest.Mock).mockResolvedValue({ _id: 'id-antigo', codigoSKU });

            // Espera um erro ao tentar criar produto com o SKU que já existe
            await expect(produtoService.criarProduto(input)).rejects.toThrow();

            // Verificamos que o repositório tentou buscar, mas NUNCA chamou o método de criar
            expect(produtoRepository.findBySKU).toHaveBeenCalledWith(codigoSKU);
            expect(produtoRepository.create).not.toHaveBeenCalled();
        });

    });

    describe('atualizarProduto', () => {

        it("deve lançar um erro ao tentar atualizar um produto inexistente", async () => {
            // Dados do produto inexistente (id 9999)
            const idProduto = "9999";
            const input: IProduto = {
                codigoSKU: "SKU_SISTEMA",
                descricao: "Porcelanato Teste",
                precoPrazo: 20,
                precoVista: 10,
                ativo: true,
                categoria: CategoriaProduto.PORCELANATO
            };

            // Simula que o banco não encontrou o produto para atualizar
            (produtoRepository.findById as jest.Mock).mockResolvedValue(null);

            // Espera que a função de atualização retorne erro por não ter encontrado o produto
            await expect(produtoService.atualizarProduto(idProduto, input)).rejects.toThrow()

            // Garante que o a busca foi feita e que o método de atualização NUNCA foi chamado
            expect(produtoRepository.findById).toHaveBeenCalledWith(idProduto);
            expect(produtoRepository.update).not.toHaveBeenCalled();
        });

    })
});