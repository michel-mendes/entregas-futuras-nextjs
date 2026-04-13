import { NextRequest, NextResponse } from 'next/server';
import { produtoService } from '@/services/produto.service';
import { CreateProdutoDTO, ListarProdutosDTO } from '@/dtos/produto.dto';
import { z } from 'zod';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validação via DTO. Se falhar, joga o erro capturado no catch
        const dadosValidados = CreateProdutoDTO.parse(body);

        // Passa os dados limpos para o Service
        const novoProduto = await produtoService.criarProduto(dadosValidados);

        return NextResponse.json(novoProduto, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ erro: "Dados inválidos", detalhes: error.issues }, { status: 400 });
        }
        // Erros de regra de negócio (ex: SKU duplicado) vindos do Service
        return NextResponse.json({ erro: error.message }, { status: 409 });
    }
}

export async function GET(req: NextRequest) {
    try {
        // Extrai os query params da URL (?page=1&limit=20)
        const { searchParams } = new URL(req.url);
        const params = Object.fromEntries(searchParams.entries());

        // Valida e aplica os padrões (defaults) configurados no DTO
        const parametrosValidados = ListarProdutosDTO.parse(params);

        const resultadoPaginado = await produtoService.listarProdutos(parametrosValidados);

        return NextResponse.json(resultadoPaginado, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ erro: "Erro ao buscar produtos" }, { status: 500 });
    }
}