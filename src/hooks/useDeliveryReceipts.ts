import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { DeliveryReceiptFilter } from "@/modules/delivery-receipt/domain/delivery-receipt.repository";
import { deliveryReceiptsApi } from "@/modules/delivery-receipt/presentation/delivery-receipt.api";

export const DELIVERY_RECEIPT_QUERY_KEY = "delivery-receipt";

export function useDeliveryReceipts(params: DeliveryReceiptFilter) {
    const queryParams: DeliveryReceiptFilter = {
        ...params,
        page: params.page || 1,
        limit: params.limit || 10,
    };

    return useQuery<Awaited<ReturnType<typeof deliveryReceiptsApi.fetchDeliveryReceipts>>, Error>({
        queryKey: ["delivery-receipts", "list", queryParams],
        queryFn: () => deliveryReceiptsApi.fetchDeliveryReceipts(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });
};

export function useGetDeliveryReceiptById(id: string) {
    return useQuery<Awaited<ReturnType<typeof deliveryReceiptsApi.getDeliveryReceiptById>>, Error>({
        queryKey: [DELIVERY_RECEIPT_QUERY_KEY, id],
        queryFn: async () => deliveryReceiptsApi.getDeliveryReceiptById(id),
        enabled: Boolean(id),
        staleTime: 1000 * 60 * 5,
    });
}