import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBatches } from "@/modules/lote/infrastructure/lote.api.client";
import { BatchSearchFilters } from "@/modules/lote/domain/lote.repository";

export function useLotes(params: BatchSearchFilters) {
    const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        productName: params.productName,
        warehouseName: params.warehouseName,
        status: params.status
    };

    const result = useQuery({
        queryKey: ["lotes", "listagem", queryParams],
        queryFn: () => fetchBatches(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    return result
}