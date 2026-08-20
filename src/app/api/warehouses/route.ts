import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeWarehouseService } from "@/modules/warehouse/application/warehouse.service";
import { createWarehouseValidationSchema, listWarehousesValidationSchema } from "@/modules/warehouse/presentation/warehouse.validation";
import { NextRequest } from "next/server";

const serviceWarehouses = makeWarehouseService();

export const GET = apiWrapper(async (req: NextRequest) => {
    const params = Object.fromEntries( new URL(req.url).searchParams );
    const validatedQuery = listWarehousesValidationSchema.parse(params);

    const result = await serviceWarehouses.listWarehouses(validatedQuery);

    return sendSuccess(result.data, 200, result.meta);
});

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();
    const validatedData = createWarehouseValidationSchema.parse(body);

    const result = await serviceWarehouses.createWarehouse(validatedData);

    return sendSuccess(result, 200);
});