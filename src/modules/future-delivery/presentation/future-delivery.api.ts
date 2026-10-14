import { ApiResponse } from "@/types/api-response.types";
import { FutureDeliveryProps } from "../domain/future-delivery.entity";
import { FutureDeliveryFilter } from "../domain/future-delivery.repository";
import { CreateFutureDeliveryInput, UpdateDeliveryAddressInput } from "../application/future-delivery.validator";
import { handleApiResponse } from "@/lib/api/api-response-handler";
import { CreateDeliveryReceiptInput } from "@/modules/delivery-receipt/application/delivery-receipt.validator";
import { FutureDeliveryFulfilledReceiptProps } from "../application/use-cases/register-delivery.use-case";

const BASE_URL = "/api/future-deliveries";

export const futureDeliveriesApi = {

    async fetchFutureDeliveries(params: FutureDeliveryFilter): Promise<ApiResponse<FutureDeliveryProps[]>> {
        const url = new URL(BASE_URL, window.location.origin);

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            };
        });

        const response = await fetch(url.toString(), {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return await handleApiResponse<FutureDeliveryProps[]>(response);
    },

    async getFutureDeliveryById(id: string): Promise<ApiResponse<FutureDeliveryProps>> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        return await handleApiResponse<FutureDeliveryProps>(response);
    },

    async createFutureDelivery(input: CreateFutureDeliveryInput): Promise<ApiResponse<FutureDeliveryProps>> {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        return await handleApiResponse<FutureDeliveryProps>(response);
    },

    async registerPartialDelivery(deliveryId: string, input: CreateDeliveryReceiptInput): Promise<ApiResponse<FutureDeliveryFulfilledReceiptProps>> {
        const response = await fetch(`${BASE_URL}/${deliveryId}/register-partial-delivery`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input)
        });

        return await handleApiResponse<FutureDeliveryFulfilledReceiptProps>(response);
    }

}