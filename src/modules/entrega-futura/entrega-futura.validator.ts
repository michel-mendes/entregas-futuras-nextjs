import { z } from 'zod';
import { StatusEntrega } from './entrega-futura.types';

// Validar ObjectIds do MongoDB uando regex (24 caracteres hexadecimais)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// v--- Schemas base ---v
const clienteSchema = z.object({
    nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').trim(),
    
    // Remover pontuações e enviar somente números para o banco
    documento: z.string()
        .transform(doc => doc.replace(/\D/g, ''))
        .refine(doc => doc.length === 11 || doc.length === 14, 'Documento deve ser um CPF (11) ou CNPJ (14) válido'),
    telefone: z.string().min(10, 'Telefone inválido, inclua o DDD').trim(),
});

const enderecoSchema = z.object({
    cep: z.string().transform(cep => cep.replace(/\D/g, ''))
        .refine(doc => doc.length < 8, "CEP inválido"),

    logradouro: z.string().min(3, 'Logradouro é obrigatório').trim(),
    numero: z.string().min(1, 'Número é obrigatório').trim(),
    complemento: z.string().optional(),
    bairro: z.string(),
    cidade: z.string().min(2, 'Cidade é obrigatória').trim(),
    uf: z.string().length(2, 'UF deve conter exatos 2 caracteres').toUpperCase(),
});

const itemCriacaoSchema = z.object({
    produtoId: z.string().regex(objectIdRegex, 'ID de produto inválido ou corrompido'),
    descricao: z.string().min(3, 'A descrição do produto é obrigatória'),
    quantidadeComprada: z.number().min(0.001, "Quantidade é obrigatória")
        .int('A quantidade deve ser um número inteiro')
        .positive('A quantidade comprada deve ser maior que zero'),
});



// v--- Schemas de criação, alteração, etc ---v
export const criarEntregaFuturaSchema = z.object({
    cliente: clienteSchema,
    enderecoEntrega: enderecoSchema,
    itens: z.array(itemCriacaoSchema).min(1, 'A entrega deve conter pelo menos um item para ser registrada'),
});

export const registrarBaixaParcialSchema = z.object({
    itemId: z.string().regex(objectIdRegex, 'ID do item inválido'),
    quantidadeEntregue: z.number().min(0.001, "Quantidade é obrigatória")
        .int('A quantidade entregue deve ser um número inteiro')
        .positive('A baixa deve ser de pelo menos 1 unidade'),
});


// Schema de busca / listagme ---v
export const listarEntregasQuerySchema = z.object({
    // coerce converte strings da URL (ex: ?pagina=2) para numbers automaticamente
    pagina: z.coerce.number().int().positive().default(1),
    limite: z.coerce.number().int().positive().max(100, 'Limite máximo de 100 itens por página').default(20),
    status: z.enum(StatusEntrega, 'Status de entrega inválido').optional(),
    nomeCliente: z.string().optional(),
    documentoCliente: z.string().transform(doc => doc.replace(/\D/g, '')).optional(),
});


// Exportar para uso em controller e Hook Form
export type CriarEntregaFuturaInput = z.infer<typeof criarEntregaFuturaSchema>;
export type RegistrarBaixaParcialInput = z.infer<typeof registrarBaixaParcialSchema>;
export type ListarEntregasQueryInput = z.infer<typeof listarEntregasQuerySchema>;