import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchLotes } from "@/modules/lote/infrastructure/lote.api.client";

export function useLotes(pagina: number, limite: number = 10) {
    const result = useQuery({
        queryKey: ["lotes", "listagem", pagina, limite],
        queryFn: () => fetchLotes({limite, pagina}),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    return result
}