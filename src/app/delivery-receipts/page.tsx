"use client";

import { SubmitEvent, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";

import { useDeliveryReceipts } from "@/hooks/useDeliveryReceipts";
import {
  FriendlyDeliveryReceiptStatusFilterName,
  getFriendlyReceiptStatusNames,
} from "@/modules/delivery-receipt/domain/delivery-receipt.entity";
import { DeliveryReceiptFilter } from "@/modules/delivery-receipt/domain/delivery-receipt.repository";
import { DeliveryReceiptHeader } from "./components/DeliveryReceiptHeader";
import { DeliveryReceiptFilters } from "./components/DeliveryReceiptFilters";
import { DeliveryReceiptTable } from "./components/DeliveryReceiptTable";
import { DeliveryReceiptFooter } from "./components/DeliveryReceiptFooter";

const PAGE_SIZE = 10;

export default function DeliveryReceiptsPage() {
  const [draftFilters, setDraftFilters] = useState<DeliveryReceiptFilter>({
    limit: PAGE_SIZE,
    page: 1,
    status: "ALL",
    deliveryNumber: "",
    recipientName: "",
    startDate: undefined,
    endDate: undefined,
  });

  const [filters, setFilters] = useState<DeliveryReceiptFilter>({
    ...draftFilters,
  });

  const deliveryReceiptsQuery = useDeliveryReceipts(filters);

  const receipts = deliveryReceiptsQuery.data?.data ?? [];
  const metadata = deliveryReceiptsQuery.data?.meta;

  const totalPages = metadata?.totalPaginas ?? 1;
  const currentPage = metadata?.paginaAtual ?? filters.page;

  const applyFilters = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFilters({
      ...draftFilters,
      page: 1, // Reseta para a primeira página ao filtrar
    });
  };

  const clearFilters = () => {
    const defaultFilters: DeliveryReceiptFilter = {
      limit: PAGE_SIZE,
      page: 1,
      status: "ALL",
      deliveryNumber: "",
      recipientName: "",
      startDate: undefined,
      endDate: undefined,
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
    const statusList: FriendlyDeliveryReceiptStatusFilterName[] = [];
    statusList.push(...getFriendlyReceiptStatusNames());
    return statusList;
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
      <DeliveryReceiptHeader />

      <DeliveryReceiptFilters
        draftFilters={draftFilters}
        setDraftFilters={setDraftFilters}
        statusesNames={statusesNames}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      {/* Error alert */}
      {deliveryReceiptsQuery.isError ? (
        <div
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>
            {deliveryReceiptsQuery.error?.message ||
              "An error occurred while fetching delivery receipts."}
          </span>
        </div>
      ) : null}

      <DeliveryReceiptTable
        receipts={receipts}
        isLoading={
          deliveryReceiptsQuery.isPending || deliveryReceiptsQuery.isFetching
        }
      />

      <DeliveryReceiptFooter
        totalRecords={metadata?.totalRegistros ?? receipts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        isFetching={deliveryReceiptsQuery.isFetching}
        onPageChange={changePage}
      />
    </main>
  );
}