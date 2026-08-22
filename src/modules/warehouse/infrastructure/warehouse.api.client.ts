import { ApiResponse } from "@/types/api-response.types";
import { IWarehouseProps } from "../domain/warehouse.entity";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "../presentation/warehouse.validation";
import { ListWarehousesParams } from "../domain/warehouse.repository";
import { AppError } from "@/lib/errors/AppError";
import { handleApiResponse } from "@/lib/api/api-response-handler";
// import { handleApiResponse } from "@/lib/api/route-wrapper";


export async function fetchWarehouses(params: ListWarehousesParams): Promise<ApiResponse<IWarehouseProps[]>> {
    const url = new URL("/api/warehouses", window.location.origin);

    url.searchParams.append("page", params.page.toString());
    url.searchParams.append("limit", params.limit.toString());

    if (params.name) url.searchParams.append("name", params.name);
    if (params.sector) url.searchParams.append("sector", params.sector);
    if (params.status && params.status !== "ALL") url.searchParams.append("status", params.status);

    const response = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });

    return await handleApiResponse<IWarehouseProps[]>(response);
}

export async function createWarehouseApi(data: CreateWarehouseDTO): Promise<IWarehouseProps> {
    const response = await fetch("/api/warehouses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await handleApiResponse<IWarehouseProps>(response);

    return result.data as IWarehouseProps;
}

export async function updateWarehouseApi(id: string, data: UpdateWarehouseDTO): Promise<IWarehouseProps> {
    const response = await fetch(`/api/warehouses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await handleApiResponse<IWarehouseProps>(response);
    return result.data as IWarehouseProps;
}

export async function toggleWarehouseStatusApi(id: string, activate: boolean): Promise<IWarehouseProps> {
    const response = await fetch(`/api/warehouses/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activate })
    });

    const result = await handleApiResponse<IWarehouseProps>(response);

    return result.data as IWarehouseProps;
}