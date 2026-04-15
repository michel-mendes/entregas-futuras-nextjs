import { NextRequest, NextResponse } from 'next/server';
import { produtoService } from '@/modules/produto/produto.service';
import { UpdateProdutoDTO } from '@/modules/produto/produto.dto';
import { apiWrapper, sendSuccess } from '@/lib/api/route-wrapper';

interface RouteParams { id: string }

export const GET = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await params;
    const produto = await produtoService.buscarProdutoPorId(id);

    return sendSuccess(produto);
});

export const PUT = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const body = await req.json();

    const dadosValidados = UpdateProdutoDTO.parse(body);
    const { id } = await params;

    const produtoAtualizado = await produtoService.atualizarProduto(id, dadosValidados);

    return sendSuccess(produtoAtualizado);
});

export const DELETE = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await params;

    await produtoService.desativarProduto(id);

    // Retorno padrão para DELETE é payload vazio com 204 (No Content)
    return new NextResponse(null, { status: 204 });
});