interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle bg-surface">
            <span className="text-xs text-tertiary">Página {currentPage} de {totalPages}</span>
            <div className="flex gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg disabled:opacity-50 hover:bg-subtle transition-colors"
                >
                    Anterior
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-xs font-medium border border-border rounded-lg disabled:opacity-50 hover:bg-subtle transition-colors"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}