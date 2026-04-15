import { z } from 'zod';
import { CategoriaProduto } from '@/modules/produto/produto.types';

const ProdutoBaseSchema = z.object({
    codigoSKU: z.string().min(1, "SKU / código de barras é obrigatório"),
    descricao: z.string().min(3, "Descrição deve ter no mínimo 3 caracteres"),

    urlImagem: z.literal("").or(z.url("A URL da imagem informada é inválida")).optional(),

    precoVista: z.number().nonnegative("Preço à vista não pode ser negativo"),
    precoPrazo: z.number().nonnegative("Preço a prazo não pode ser negativo"),
    categoria: z.enum(CategoriaProduto),
    ativo: z.boolean(),
    pesoEmbalagemKg: z.number().positive("O peso deve ser maior que zero").optional(),
    m2Embalagem: z.number().positive("A metragem deve ser maior que zero").optional(),
});

const validarRegrasDeCategoria = (data: any, ctx: z.RefinementCtx) => {
    // Se for uma atualização parcial e a categoria não foi enviada no payload, 
    // não temos como validar peso/m2 em relação à categoria aqui no DTO.
    if (!data.categoria) return;

    const exigePesoEM2 = [CategoriaProduto.PISO, CategoriaProduto.PORCELANATO].includes(data.categoria);
    const exigeApenasPeso = [CategoriaProduto.ARGAMASSA, CategoriaProduto.REJUNTE].includes(data.categoria);

    if ((exigePesoEM2 || exigeApenasPeso) && data.pesoEmbalagemKg === undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "O peso da embalagem é obrigatório para esta categoria.",
            path: ["pesoEmbalagemKg"],
        });
    }

    if (exigePesoEM2 && data.m2Embalagem === undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "A metragem (m²) da embalagem é obrigatória para pisos e porcelanatos.",
            path: ["m2Embalagem"],
        });
    }
};

export const CreateProdutoDTO = ProdutoBaseSchema.superRefine(validarRegrasDeCategoria);
export const UpdateProdutoDTO = ProdutoBaseSchema.omit({ codigoSKU: true }).partial().superRefine(validarRegrasDeCategoria);

export const ListarProdutosDTO = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    termoBusca: z.string().optional(),
    apenasAtivos: z.enum(['true', 'false']).optional().transform(val => (val === undefined) ? undefined : val === 'true'),
});


export type CreateProdutoInput = z.infer<typeof CreateProdutoDTO>;
export type UpdateProdutoInput = z.infer<typeof UpdateProdutoDTO>;
export type ListarProdutosInput = z.infer<typeof ListarProdutosDTO>;