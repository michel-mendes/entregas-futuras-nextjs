import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { ListWarehousesParams } from "@/modules/warehouse/domain/warehouse.repository";
import { CreateWarehouseDTO, UpdateWarehouseDTO } from "@/modules/warehouse/presentation/warehouse.validation";
import {
    fetchWarehouses,
    createWarehouseApi,
    updateWarehouseApi,
    toggleWarehouseStatusApi
} from "@/modules/warehouse/infrastructure/warehouse.api.client";

// -----------------------------------------------------------------------------
// LEITURA (QUERIES) / GET
// -----------------------------------------------------------------------------

export function useWarehouses(params: ListWarehousesParams) {
    const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        name: params.name,
        sector: params.sector,
        status: params.status
    };

    return useQuery<Awaited<ReturnType<typeof fetchWarehouses>>, Error>({
        queryKey: ["warehouses", "list", queryParams],
        queryFn: () => fetchWarehouses(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // cache de 5 minutos
    });
}


// -----------------------------------------------------------------------------
// ESCRITA (MUTATIONS) / POST & PATCH
// -----------------------------------------------------------------------------

export function useCreateWarehouse() {
    const queryClient = useQueryClient();

    return useMutation<Awaited<ReturnType<typeof createWarehouseApi>>, Error, CreateWarehouseDTO>({
        mutationFn: (data) => createWarehouseApi(data),
        onSuccess: () => {
            // Invalida a lista para forçar um refetch e mostrar o novo depósito
            queryClient.invalidateQueries({ queryKey: ["warehouses", "list"] });
        },
    });
}

export function useUpdateWarehouse() {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof updateWarehouseApi>>,
        Error,
        { id: string; data: UpdateWarehouseDTO }
    >({
        mutationFn: ({ id, data }) => updateWarehouseApi(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["warehouses", "list"] });
        },
    });
}

export function useToggleWarehouseStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof toggleWarehouseStatusApi>>,
        Error,
        { id: string; activate: boolean }
    >({
        mutationFn: ({ id, activate }) => toggleWarehouseStatusApi(id, activate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["warehouses", "list"] });
        },
    });
}