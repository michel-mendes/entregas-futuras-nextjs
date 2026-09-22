import { apiWrapper, sendSuccess } from '@/lib/api/route-wrapper';
import { AppError } from '@/lib/errors/AppError';
import { CreateProductSchema, ListProductsQuerySchema } from '@/modules/product/application/product.validator';
import { FindAllProductsUseCase } from '@/modules/product/application/use-cases/find-all-products.use-case';
import { MongooseProductRepository } from '@/modules/product/infrasctructure/product.mongoose-repository';
import { ProductModel } from '@/modules/product/infrasctructure/product.model';
import { CreateProductUseCase } from '@/modules/product/application/use-cases/create-product.use-case';
import { NextRequest } from 'next/server';

const mongooseProductRepository = new MongooseProductRepository(ProductModel);
const findAllProductsUseCase = new FindAllProductsUseCase(mongooseProductRepository);
const createProductUseCase = new CreateProductUseCase(mongooseProductRepository);

export const GET = apiWrapper(async (req: NextRequest) => {
    const params = Object.fromEntries(new URL(req.url).searchParams);
    const validatedQuery = ListProductsQuerySchema.safeParse(params);
    const { data: filters, error } = validatedQuery;

    if (error) {
        throw AppError.BadRequest(`Invalid query parameters for product listing: ${error.message}`);
    }

    const response = await findAllProductsUseCase.execute(filters);
    
    return sendSuccess(response.data, 200, response.meta);
});

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();
    const validatedBody = CreateProductSchema.safeParse(body);
    const { data, error } = validatedBody;

    if (error) {
        throw AppError.BadRequest(`Invalid request body for product creation: ${error.message}`);
    }

    const response = await createProductUseCase.execute(data);
    return sendSuccess(response, 201);
});