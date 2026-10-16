import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { AppError } from "@/lib/errors/AppError";
import { DeliveryReceiptIdParamSchema } from "@/modules/delivery-receipt/application/delivery-receipt.validator";
import { GetDeliveryReceiptByIdUseCase } from "@/modules/delivery-receipt/application/use-cases/get-delivery-receipt-by-id.use-case";
import { DeliveryReceiptModel } from "@/modules/delivery-receipt/infrastructure/delivery-receipt.model";
import { MongooseDeliveryReceiptRepository } from "@/modules/delivery-receipt/infrastructure/delivery-receipt.mongoose-repository";
import { NextRequest } from "next/server";

interface RouteParams { id: string };

const mongooseReceiptRepository = new MongooseDeliveryReceiptRepository(DeliveryReceiptModel);
const findReceiptByIdUseCase = new GetDeliveryReceiptByIdUseCase(mongooseReceiptRepository);

export const GET = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const validatedId = await DeliveryReceiptIdParamSchema.safeParse(await params);
    const { data, error } = validatedId;

    if (error) {
        throw AppError.BadRequest(`Invalid ID parameter for delivery receipt fetching: ${error.message}`);
    }

    const receipt = await findReceiptByIdUseCase.execute({ id: data.id });

    return sendSuccess(receipt, 200);
});