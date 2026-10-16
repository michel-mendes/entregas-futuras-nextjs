"use client";

import { use } from "react";
import { AlertCircle, Truck } from "lucide-react";
import { useGetDeliveryReceiptById } from "@/hooks/useDeliveryReceipts";
import { DeliveryReceiptPrintToolbar } from "./components/DeliveryReceiptPrintToolbar";
import { DeliveryReceiptPrintSheet } from "./components/DeliveryReceiptPrintSheet";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function DeliveryReceiptPrintPage({ params }: PageProps) {
    const { id } = use(params);
    const { data: receipt, isLoading, isError, error } = useGetDeliveryReceiptById(id);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 print:bg-white">
                <div className="flex items-center gap-2 text-sm text-secondary">
                    <Truck className="h-5 w-5 animate-bounce text-brand" />
                    <span>Preparing receipt for printing...</span>
                </div>
            </div>
        );
    }

    if (isError || !receipt) {
        return (
            <div className="mx-auto mt-10 max-w-md rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span>Failed to load delivery receipt</span>
                </div>
                <p className="mt-1 text-xs text-red-600">
                    {error?.message || "Delivery receipt not found or invalid ID."}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 print:bg-transparent">
            <DeliveryReceiptPrintToolbar receiptNumber={receipt.data?.deliveryNumber} />

            <main className="flex justify-center">
                {
                    receipt.data && <DeliveryReceiptPrintSheet receipt={receipt.data} />
                }
            </main>
        </div>
    );
}