import { NextRequest } from 'next/server';
import { EntregaFuturaService } from '@/modules/entrega-futura/entrega-futura.service';
import { apiWrapper, sendSuccess } from '@/lib/api/route-wrapper';
import { connectToDatabase } from '@/lib/db/mongoose';

const entregaService = new EntregaFuturaService();

interface RouteParams { id: string }

export const GET = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    await connectToDatabase()

    const { id } = await params;
    const entrega = await entregaService.buscarEntrega(id);

    return sendSuccess(entrega);
});