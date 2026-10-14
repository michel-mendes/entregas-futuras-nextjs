import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { AppError } from "@/lib/errors/AppError";
import { CreateDeliveryReceiptSchema } from "@/modules/delivery-receipt/application/delivery-receipt.validator";
import { DeliveryReceiptModel } from "@/modules/delivery-receipt/infrastructure/delivery-receipt.model";
import { MongooseDeliveryReceiptRepository } from "@/modules/delivery-receipt/infrastructure/delivery-receipt.mongoose-repository";
import { FutureDeliveryIdParamSchema } from "@/modules/future-delivery/application/future-delivery.validator";
import { RegisterDeliveryAndIssueDeliveryReceiptUseCase } from "@/modules/future-delivery/application/use-cases/register-delivery.use-case";
import { FutureDeliveryModel } from "@/modules/future-delivery/infrastructure/future-delivery.model";
import { MongooseFutureDeliveryRepository } from "@/modules/future-delivery/infrastructure/future-delivery.mongoose-repository";
import { NextRequest } from "next/server";

interface RouteParams { id: string };

const mongooseDeliveryReceiptRepository = new MongooseDeliveryReceiptRepository(DeliveryReceiptModel);
const mongooseFutureDeliveryRepository = new MongooseFutureDeliveryRepository(FutureDeliveryModel);
const registerDeliveryAndReceiptUseCase = new RegisterDeliveryAndIssueDeliveryReceiptUseCase(mongooseFutureDeliveryRepository, mongooseDeliveryReceiptRepository);

export const POST = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await FutureDeliveryIdParamSchema.parseAsync(await params);

    const body = await req.json();
    const validatedBody = CreateDeliveryReceiptSchema.safeParse(body);
    const { data, error } = validatedBody;

    if (error) {
        throw AppError.BadRequest(`Invalid request body for delivery receipt creation: ${error.message}`);
    }

    const result = await registerDeliveryAndReceiptUseCase.execute(id, data);
    return sendSuccess(result, 201);
});