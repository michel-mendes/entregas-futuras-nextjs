import { NextRequest } from 'next/server';
import { EntregaFuturaService } from '@/modules/entrega-futura/entrega-futura.service';
import { criarEntregaFuturaSchema, listarEntregasQuerySchema } from '@/modules/entrega-futura/entrega-futura.validator';
import { apiWrapper, sendSuccess } from '@/lib/api/route-wrapper';

const entregaService = new EntregaFuturaService();


export const GET = apiWrapper(async (req: NextRequest) => {
    // extrai os parâmetros recebidos na rota
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);

    // valida os parÂmetros
    const query = listarEntregasQuerySchema.parse(searchParams);

    const resultadoPaginado = await entregaService.listarEntregas(query);

        return sendSuccess(resultadoPaginado.data, 200, resultadoPaginado.meta);
});


export const POST = apiWrapper(async (req: NextRequest) => {
    // extrai os dados da entrega
    const body = await req.json();

    // validar os dados
    const dadosValidados = criarEntregaFuturaSchema.parse(body);

    const novaEntrega = await entregaService.criarEntrega(dadosValidados);

    return sendSuccess(novaEntrega, 201);
});