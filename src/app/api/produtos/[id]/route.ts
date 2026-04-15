import { NextRequest, NextResponse } from 'next/server';
import { produtoService } from '@/modules/produto/produto.service';
import { UpdateProdutoDTO } from '@/modules/produto/produto.dto';
import { z } from 'zod';

interface RouteParams { id: string }

export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
    try {
        const { id } = await params
        const produto = await produtoService.buscarProdutoPorId(id);

        return NextResponse.json(produto, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ erro: error.message }, { status: 404 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
    try {
        const body = await req.json();
        const dadosValidados = UpdateProdutoDTO.parse(body);
        const { id } = await params

        const produtoAtualizado = await produtoService.atualizarProduto(id, dadosValidados);

        return NextResponse.json(produtoAtualizado, { status: 200 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ erro: "Dados inválidos", detalhes: error.issues }, { status: 400 });
        }
        return NextResponse.json({ erro: error.message }, { status: 404 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
    try {
        const { id } = await params
        await produtoService.desativarProduto(id);

        // 204 No Content é o padrão REST correto para deleção com sucesso
        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        return NextResponse.json({ erro: error.message }, { status: 404 });
    }
}