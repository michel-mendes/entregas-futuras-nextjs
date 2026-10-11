"use client";

import { SubmitEvent, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import { FutureDeliveryFilter } from "@/modules/future-delivery/domain/future-delivery.repository";
import { FriendlyStatusData, FutureDeliveryStatus, getFriendlyStatusNames, } from "@/modules/future-delivery/domain/future-delivery.entity";
import { useFutureDeliveries } from "@/hooks/useFutureDeliveries";

import { FutureDeliveryHeader } from "./components/FutureDeliveryHeader";
import { FutureDeliveryFilters } from "./components/FutureDeliveryFilters";
import { FutureDeliveryTable } from "./components/FutureDeliveryTable";
import { FutureDeliveryFooter } from "./components/FutureDeliveryFooter";

const PAGE_SIZE = 10;

export default function FutureDeliveriesPage() {
    const [draftFilters, setDraftFilters] = useState<FutureDeliveryFilter>({
        limit: PAGE_SIZE,
        page: 1,
        status: FutureDeliveryStatus.PENDING,
        customerName: "",
        customerDocument: "",
    });

    const [filters, setFilters] = useState<FutureDeliveryFilter>({
        ...draftFilters,
    });

    const futureDeliveriesQuery = useFutureDeliveries(filters);

    const deliveries = futureDeliveriesQuery.data?.data ?? [];
    const metadata = futureDeliveriesQuery.data?.meta;

    const totalPages = metadata?.totalPaginas ?? 1;
    const currentPage = metadata?.paginaAtual ?? filters.page;

    const applyFilters = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFilters({
            ...draftFilters,
            page: 1, // Reseta para a primeira página ao aplicar novo filtro
        });
    };

    const clearFilters = () => {
        const defaultFilters: FutureDeliveryFilter = {
            limit: PAGE_SIZE,
            page: 1,
            status: FutureDeliveryStatus.PENDING,
            customerDocument: "",
            customerName: "",
        };

        setDraftFilters({ ...defaultFilters });
        setFilters({ ...defaultFilters });
    };

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        setDraftFilters((prev) => ({ ...prev, page }));
        setFilters((prev) => ({ ...prev, page }));
    };

    const statusesNames = useMemo(() => {
        const statusList: FriendlyStatusData[] = [];
        statusList.push(...getFriendlyStatusNames());
        return statusList;
    }, []);

    return (
        <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">

            <FutureDeliveryHeader />

            <FutureDeliveryFilters
                draftFilters={draftFilters}
                setDraftFilters={setDraftFilters}
                statusesNames={statusesNames}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
            />

            {/* Erro alert */}
            {futureDeliveriesQuery.isError ? (
                <div
                    className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                >
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                    <span>{futureDeliveriesQuery.error.message}</span>
                </div>
            ) : null}

            <FutureDeliveryTable
                deliveries={deliveries}
                isLoading={futureDeliveriesQuery.isPending}
            />

            <FutureDeliveryFooter
                totalRecords={metadata?.totalRegistros ?? 0}
                currentPage={currentPage}
                totalPages={totalPages}
                isFetching={futureDeliveriesQuery.isFetching}
                onPageChange={changePage}
            />
        </main>
    );
}