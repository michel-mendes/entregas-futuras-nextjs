export interface ApiMetadata {
    totalRegistros: number;
    totalPaginas: number;
    paginaAtual: number;
    itensPorPagina: number;
    temPaginaAnterior: boolean;
    temProximaPagina: boolean;
}

export interface ApiErrorData {
    code: string;       // 'VALIDATION_ERROR', 'NOT_FOUND', 'CONFLICT', etc...
    message: string;    // Mensagem ao usuário (texto amigável sem detalhes)
    details?: string[]; // Lista de erros detalhados caso houver (ex: falhas do Zod)
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ApiErrorData;
    meta?: ApiMetadata;
}