import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { ProductIdParamSchema, UpdateProductSchema } from "@/modules/product/application/product.validator";
import { DeleteProductUseCase } from "@/modules/product/application/use-cases/delete-product.use-case";
import { GetProductByIdUseCase } from "@/modules/product/application/use-cases/get-product-by-id.use-case";
import { UpdateProductUseCase } from "@/modules/product/application/use-cases/update-product.use-case";
import { ProductModel } from "@/modules/product/infrasctructure/product.model";
import { MongooseProductRepository } from "@/modules/product/infrasctructure/product.mongoose-repository";
import { NextRequest } from "next/server";

interface RouteParams { id: string };

const mongooseProductRepository = new MongooseProductRepository(ProductModel);
const findProductByIdUseCase = new GetProductByIdUseCase(mongooseProductRepository);
const updateProductUseCase = new UpdateProductUseCase(mongooseProductRepository);
const deleteProductUseCase = new DeleteProductUseCase(mongooseProductRepository);

// -----------------------------
// GET /api/products/[id]
// -----------------------------
export const GET = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await ProductIdParamSchema.parseAsync(await params);
    const product = await findProductByIdUseCase.execute(id);

    return sendSuccess(product, 200);
});


// -----------------------------
// PATCH /api/products/[id]
// -----------------------------
export const PATCH = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await ProductIdParamSchema.parseAsync(await params);
    const body = await req.json();

    const validatedBody = UpdateProductSchema.parse(body);

    const product = await updateProductUseCase.execute(id, { ...validatedBody })

    return sendSuccess(product, 200);
});


// -----------------------------
// DELETE /api/products/[id]
// -----------------------------
export const DELETE = apiWrapper(async (req: NextRequest, { params }: { params: Promise<RouteParams> }) => {
    const { id } = await ProductIdParamSchema.parseAsync(await params);
    
    await deleteProductUseCase.execute(id);

    return sendSuccess({ message: "Product deleted successfully." }, 200);
});