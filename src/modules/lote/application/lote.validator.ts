import { z } from "zod";

export const criarLoteSchemaValidacao = z.object({
    idProduto: z.string().min(1, "ID do produto é obrigatório"),
    idDeposito: z.string().min(1, "ID do depósito é obrigatório"),
    bitola: z.number().int("O número da bitola deve ser um número inteiro"),
    tonalidade: z.number().int("O número da tonalidade deve ser um número inteiro"),
    quantidadeInicial: z.number().min(0.01, "A quantidade inicial deve ser maior que zero"),
    numeroLote: z.string().optional(),
    localizacaoDetalhada: z.string().optional(),
    observacoes: z.string().optional()
});

export const listarLotesSchemaValidacao = z.object({
    pagina: z.coerce.number().int().min(1).default(1),
    limite: z.coerce.number().int().min(1).max(100).default(10)
});