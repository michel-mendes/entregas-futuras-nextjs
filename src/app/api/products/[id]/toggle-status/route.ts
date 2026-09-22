import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { ProductIdParamSchema, UpdateProductSchema } from "@/modules/product/application/product.validator";
import { ToggleProductStatusUseCase } from "@/modules/product/application/use-cases/toggle-status-product.use-case";
import { ProductModel } from "@/modules/product/infrasctructure/product.model";
import { MongooseProductRepository } from "@/modules/product/infrasctructure/product.mongoose-repository";
import { NextRequest } from "next/server";

interface RouteParams { id: string };

const mongooseProductRepository = new MongooseProductRepository(ProductModel);
const toggleProductStatusUseCase = new ToggleProductStatusUseCase(mongooseProductRepository);

export const PATCH = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await ProductIdParamSchema.parseAsync(await params);
    const body = await req.json();

    const validatedBody = UpdateProductSchema.parse(body);
    const { active } = validatedBody;

    const updatedProduct = await toggleProductStatusUseCase.execute(id, active!)

    return sendSuccess(updatedProduct, 200);
})