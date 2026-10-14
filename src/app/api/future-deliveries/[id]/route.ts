import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { FutureDeliveryIdParamSchema } from "@/modules/future-delivery/application/future-delivery.validator";
import { GetFutureDeliveryByIdUseCase } from "@/modules/future-delivery/application/use-cases/get-future-delivery-by-id.use-case";
import { FutureDeliveryModel } from "@/modules/future-delivery/infrastructure/future-delivery.model";
import { MongooseFutureDeliveryRepository } from "@/modules/future-delivery/infrastructure/future-delivery.mongoose-repository";
import { NextRequest } from "next/server";

interface RouteParams { id: string };

const mongooseFutureRepository = new MongooseFutureDeliveryRepository(FutureDeliveryModel);
const findFutureDeliveryByIdUseCase = new GetFutureDeliveryByIdUseCase(mongooseFutureRepository);

export const GET = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await FutureDeliveryIdParamSchema.parseAsync(await params);
    const futureDelivery = await findFutureDeliveryByIdUseCase.execute(id);

    return sendSuccess(futureDelivery, 200);
});