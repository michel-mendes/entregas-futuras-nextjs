import { NextRequest } from 'next/server';
import { EntregaFuturaService } from '@/modules/entrega-futura/entrega-futura.service';
import { apiWrapper, sendSuccess } from '@/lib/api/route-wrapper';

const entregaService = new EntregaFuturaService();

interface RouteParams { id: string }

export const GET = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {

    const { id } = await params;
    const entrega = await entregaService.buscarEntrega(id);

    return sendSuccess(entrega);
});