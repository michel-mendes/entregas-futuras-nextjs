export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;       // 'VALIDATION_ERROR', 'NOT_FOUND', 'CONFLICT', etc...
        message: string;    // Mensagem amigável
        details?: string[]; // Lista de erros detalhados caso houver (ex: falhas do Zod)
    };
    meta?: {
        page?: number;
        total?: number;
    };
}