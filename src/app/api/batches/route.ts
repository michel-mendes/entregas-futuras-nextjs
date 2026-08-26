import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeBatchService } from "@/modules/lote/application/lote.service";
import { createBatchSchema, searchBatchesSchema } from "@/modules/lote/application/lote.validator";
import { NextRequest } from "next/server";

const serviceBatch = makeBatchService();

export const GET = apiWrapper(async (req: NextRequest) => {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const validatedQuery = searchBatchesSchema.parse(params);
    
    const result = await serviceBatch.searchBatches(validatedQuery); 

    return sendSuccess(result.data, 200, result.meta)
});

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();
    const validatedData = createBatchSchema.parse(body);
  
    const result = await serviceBatch.createBatch(validatedData);
    return sendSuccess(result, 201);
});