import { NextRequest } from "next/server";
import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { CreateFutureDeliverySchema, ListFutureDeliveriesQuerySchema } from "@/modules/future-delivery/application/future-delivery.validator";
import { MongooseFutureDeliveryRepository } from "@/modules/future-delivery/infrastructure/future-delivery.mongoose-repository";
import { FutureDeliveryModel } from "@/modules/future-delivery/infrastructure/future-delivery.model";
import { FindAllFutureDeliveriesUseCase } from "@/modules/future-delivery/application/use-cases/find-all-future-deliveries.use-case";
import { AppError } from "@/lib/errors/AppError";
import { CreateFutureDeliveryUseCase } from "@/modules/future-delivery/application/use-cases/create-delivery.use-case";

const mongooseFutureDeliveryRepository = new MongooseFutureDeliveryRepository(FutureDeliveryModel);
const findAllFutureDeliveryUseCase = new FindAllFutureDeliveriesUseCase(mongooseFutureDeliveryRepository);
const createFutureDeliveryUseCase = new CreateFutureDeliveryUseCase(mongooseFutureDeliveryRepository);

export const GET = apiWrapper(async (req: NextRequest) => {
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const validatedFilters = ListFutureDeliveriesQuerySchema.safeParse(searchParams);
    const { data: filters, error } = validatedFilters;

    if (error) {
        throw AppError.BadRequest(`Invalid query parameters for future deliveris listing: ${error.message}`);
    }

    const result = await findAllFutureDeliveryUseCase.execute(filters);
    return sendSuccess(result.data, 200, result.meta);
});

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();
    const validatedBody = CreateFutureDeliverySchema.safeParse(body);
    const { data, error } = validatedBody;

    if (error) {
        throw AppError.BadRequest(`Invalid request body for future delivery creation: ${error.message}`);
    }

    const result = await createFutureDeliveryUseCase.execute(data);
    return sendSuccess(result, 201);
});