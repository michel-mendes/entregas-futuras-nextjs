import { useQuery, useQueryClient, useMutation, keepPreviousData } from "@tanstack/react-query";
import { CreateFutureDeliveryInput, UpdateDeliveryAddressInput } from "@/modules/future-delivery/application/future-delivery.validator";
import { FutureDeliveryFilter } from "@/modules/future-delivery/domain/future-delivery.repository";
import { futureDeliveriesApi } from "@/modules/future-delivery/presentation/future-delivery.api";

export function useFutureDeliveries(params: FutureDeliveryFilter) {
    const queryParams: FutureDeliveryFilter = {
        ...params,
        page: params.page || 1,
        limit: params.limit || 10,
    };

    return useQuery<Awaited<ReturnType<typeof futureDeliveriesApi.fetchFutureDeliveries>>, Error>({
        queryKey: ["future-deliveries", "list", queryParams],
        queryFn: () => futureDeliveriesApi.fetchFutureDeliveries(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });
};

export function useCreateFutureDelivery() {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof futureDeliveriesApi.createFutureDelivery>>, Error, CreateFutureDeliveryInput>({
            mutationFn: (futureDeliveryData) => futureDeliveriesApi.createFutureDelivery(futureDeliveryData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["future-deliveries", "list"] });
            }
        });
};