import { NextRequest } from "next/server";
import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { ListDeliveryReceiptsQuerySchema } from "@/modules/delivery-receipt/application/delivery-receipt.validator";
import { MongooseDeliveryReceiptRepository } from "@/modules/delivery-receipt/infrastructure/delivery-receipt.mongoose-repository";
import { DeliveryReceiptModel } from "@/modules/delivery-receipt/infrastructure/delivery-receipt.model";
import { FindAllDeliveryReceiptsUseCase } from "@/modules/delivery-receipt/application/use-cases/find-all-delivery-receipts.use-case";
import { AppError } from "@/lib/errors/AppError";

const mongooseReceiptRepository = new MongooseDeliveryReceiptRepository(DeliveryReceiptModel);
const findAllDeliveryReceiptsUseCase = new FindAllDeliveryReceiptsUseCase(mongooseReceiptRepository);

export const GET = apiWrapper(async (req: NextRequest) => {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const validatedFilters = ListDeliveryReceiptsQuerySchema.safeParse(searchParams);
    const { data: filters, error } = validatedFilters;

    if (error) {
        throw AppError.BadRequest(`Invalid query parameters for delivery receipt listing: ${error.message}`);
    }

    const result = await findAllDeliveryReceiptsUseCase.execute(filters);
    return sendSuccess(result.data, 200, result.meta);
});