export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalRegistros: number;
        totalPaginas: number;
        paginaAtual: number;
        itensPorPagina: number;
        temPaginaAnterior: boolean;
        temProximaPagina: boolean;
    };
}