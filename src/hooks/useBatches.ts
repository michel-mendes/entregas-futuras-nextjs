import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchBatches } from "@/modules/batch/infrastructure/batch.api.client";
import { BatchSearchFilters } from "@/modules/batch/domain/batch.repository";

export function useBatches(params: BatchSearchFilters) {
    const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        productName: params.productName,
        warehouseName: params.warehouseName,
        status: params.status
    };

    const result = useQuery({
        queryKey: ["batches", "search", queryParams],
        queryFn: () => fetchBatches(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    return result
}