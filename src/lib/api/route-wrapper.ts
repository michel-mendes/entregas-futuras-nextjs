import { NextRequest, NextResponse } from 'next/server';
import { AppError } from '@/lib/errors/AppError';
import { ApiResponse } from '@/types/api-response.types';
import { z } from 'zod';

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse | void> | NextResponse | void;

export function apiWrapper(handler: RouteHandler) {

    return async (req: NextRequest, context?: any): Promise<NextResponse> => {
        try {

            // PASSO 1: Tenta executar a rota original
            const result = await handler(req, context);

            // PASSO 2: Se a rota já retornou um NextResponse, repassa
            if (result instanceof NextResponse) {
                return result;
            }

            // Fallback genérico caso a rota não retorne nada (não deveria acontecer)
            return NextResponse.json(
                { success: true } as ApiResponse,
                { status: 200 }
            );

        } catch (error: any) {

            // PASSO 1: Intercepta erros de validação (Zod)
            if (error instanceof z.ZodError) {

                const response: ApiResponse = {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Os dados fornecidos são inválidos.',
                        details: error.issues.map(e => `${e.path.join('.')}: ${e.message}`),
                    },
                };

                return NextResponse.json(response, { status: 400 });

            }

            // PASSO 2: Intercepta erros de regras de negócio (AppError)
            if (error instanceof AppError) {

                const response: ApiResponse = {
                    success: false,
                    error: {
                        code: error.errorCode,
                        message: error.message,
                    },
                };

                return NextResponse.json(response, { status: error.statusCode });
            }

            // PASSO 3: Erro Desconhecido (Falha de banco, Null pointer, etc)
            console.error('[ERRO FATAL]:', error);

            const response: ApiResponse = {
                success: false,
                error: {
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Ocorreu um erro interno no servidor.',
                },
            };

            return NextResponse.json(response, { status: 500 });
        }
    };

}

export function sendSuccess<T>(data: T, status: number = 200, meta?: any) {
    const response: ApiResponse<T> = {
        success: true,
        data,
    };

    if (meta) {
        response.meta = meta;
    }

    return NextResponse.json(response, { status });
}