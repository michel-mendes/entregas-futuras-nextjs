import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeWarehouseService } from "@/modules/warehouse/application/warehouse.service";
import { NextRequest } from "next/server";

const serviceWarehouses = makeWarehouseService();

interface RouteParams { id: string }

export const PATCH = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await params;
    const body = await req.json();

    const result = await serviceWarehouses.toggleStatus(id, body.activate)

    return sendSuccess(result, 200)
});