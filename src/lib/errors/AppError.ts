export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;

    constructor(message: string, statusCode: number = 400, errorCode: string = 'BAD_REQUEST') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;

        // Mantém a stack trace limpa (padrão V8/Node)
        Error.captureStackTrace(this, this.constructor);
    }

    // Métodos estáticos para facilitar o uso no Service
    static BadRequest(message: string) {
        return new AppError(message, 400, 'BAD_REQUEST');
    }

    static NotFound(message: string) {
        return new AppError(message, 404, 'NOT_FOUND');
    }

    static Conflict(message: string) {
        return new AppError(message, 409, 'CONFLICT');
    }

    static InternalError(message: string) {
        return new AppError(message, 500, "INTERNAL_ERROR")
    }
}