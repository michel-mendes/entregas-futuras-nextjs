import { NextRequest } from 'next/server';
import { produtoService } from '@/modules/produto/produto.service';
import { CreateProdutoDTO, ListarProdutosDTO } from '@/modules/produto/produto.dto';
import { apiWrapper, sendSuccess } from '@/lib/api/route-wrapper';

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();

    // Se a validação zod falhar o apiWrapper devolve 400
    const dadosValidados = CreateProdutoDTO.parse(body);

    // Se a validação extra do serviço falhar (SKU que já existe por exemplo), o service joga o AppError e o apiWrapper devolve 409
    const novoProduto = await produtoService.criarProduto(dadosValidados);

    return sendSuccess(novoProduto, 201);
});

export const GET = apiWrapper(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Se a validação do zod falhar o apiWrapper resolve
    const parametrosValidados = ListarProdutosDTO.parse(params);

    const resultadoPaginado = await produtoService.listarProdutos(parametrosValidados);

    // Separar os dados (array) dos metadados (paginação) para o frontend receber um JSON limpo.
    return sendSuccess(resultadoPaginado.data, 200, resultadoPaginado.meta);
});