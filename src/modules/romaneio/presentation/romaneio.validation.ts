import { z } from "zod";
import { StatusRomaneio } from "../domain/romaneio.entity";

export const destinatarioValidationSchema = z.object({
    nome: z.string().min(1, "Nome do destinatário é orbigatório."),
    endereco: z.string().min(1, "Endereço do destinatário é obrigatório."),
    telefone: z.string().optional()
});

export const createRomaneio_ItemRomaneioValidationSchema = z.object({
    idProduto: z.string().min(1, "'idProduto' é obrigatório."),
    quantidade: z.coerce.number().min(0.01, "Quantidade a entregar deve ser maior que 0"),
    idLote: z.string().optional(),
    observacoesItem: z.string().optional()
});

export const createRomaneioValidationSchema = z.object({
    idEntregaFutura: z.string().min(1, "'idEntregaFutura' é obrigatório."),
    idVenda: z.string().min(1, "'idVenda' é obrigatório."),
    tipoVenda: z.string().min(1, "'tipoVenda' é obrigatório."),
    destinatario: destinatarioValidationSchema,
    itens: z.array(createRomaneio_ItemRomaneioValidationSchema),
    observacoes: z.string().optional(),
});

export const listarRomaneiosValidationSchema = z.object({
    pagina: z.coerce.number("Informar somente números.")
                    .int("Números fracionados não são válidos.")
                    .nonnegative("Valores negativos não são válidos.")
                    .gt(0, "Somente números maiores que zero.")
                    .default(1),
    limite: z.coerce.number("Informar somente números.")
                    .int("Números fracionados não são válidos.")
                    .nonnegative("Valores negativos não são válidos.")
                    .gt(0, "Somente números maiores que zero.")
                    .lte(100, "Somente números menores ou iguais a 100.")
                    .default(10),
    status: z.enum(StatusRomaneio, `Deve conter quaisquer dos valores '${Object.values(StatusRomaneio)}'`).optional()
});

export type CreateRomaneioDTO = z.infer<typeof createRomaneioValidationSchema>;
export type ListarRomaneioDTO = z.infer<typeof listarRomaneiosValidationSchema>;