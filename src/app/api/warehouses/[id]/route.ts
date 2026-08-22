import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeWarehouseService } from "@/modules/warehouse/application/warehouse.service";
import { updateWarehouseValidationSchema } from "@/modules/warehouse/presentation/warehouse.validation";
import { NextRequest } from "next/server";

const serviceWarehouses = makeWarehouseService();

interface RouteParams { id: string }

export const PATCH = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await params;
    const body = await req.json();
    const validatedData = updateWarehouseValidationSchema.parse(body);
    
    const result = await serviceWarehouses.updateWarehouse(id, validatedData);

    return sendSuccess(result, 200)
});