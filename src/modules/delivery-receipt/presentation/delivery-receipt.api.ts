import { ApiResponse } from "@/types/api-response.types";
import { handleApiResponse } from "@/lib/api/api-response-handler";
import { ListDeliveryReceiptsQuery } from "../application/delivery-receipt.validator";
import { DeliveryReceiptProps } from "../domain/delivery-receipt.entity";

const BASE_URL = "/api/delivery-receipts";

export const deliveryReceiptsApi = {

    async fetchDeliveryReceipts(params: ListDeliveryReceiptsQuery): Promise<ApiResponse<DeliveryReceiptProps[]>> {
        const url = new URL(BASE_URL, window.location.origin);

        Object.entries(params).forEach(([keyof, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(keyof, String(value));
            }
        });

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return await handleApiResponse<DeliveryReceiptProps[]>(response);
    },

    async getDeliveryReceiptById(id: string): Promise<ApiResponse<DeliveryReceiptProps>> {
        const url = new URL(`${BASE_URL}/${id}`, window.location.origin);

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return await handleApiResponse<DeliveryReceiptProps>(response);
    }

}