import { ApiResponse } from "@/types/api-response.types";
import { BatchSearchFilters } from "../domain/lote.repository";
import { BatchProps } from "../domain/lote.entity";
import { handleApiResponse } from "@/lib/api/api-response-handler";
import { CreateBatchDTO } from "../application/lote.validator";

export async function fetchBatches(params: BatchSearchFilters): Promise<ApiResponse<BatchProps[]>> {
    const url = new URL("/api/batches", window.location.origin);

    url.searchParams.append("page", params.page.toString());
    url.searchParams.append("limit", params.limit.toString());

    if (params.productName) url.searchParams.append("productName", params.productName);
    if (params.warehouseName) url.searchParams.append("warehouseName", params.warehouseName);
    if (params.status && params.status !== "ALL") url.searchParams.append("status", params.status);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    return await handleApiResponse<BatchProps[]>(response);
};

export async function createBatchApi(data: CreateBatchDTO): Promise<BatchProps> {
    const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await handleApiResponse<BatchProps>(response);

    return result.data as BatchProps;
};