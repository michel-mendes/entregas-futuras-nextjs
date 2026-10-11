import Link from "next/link";
import { Plus, Truck } from "lucide-react";

export function FutureDeliveryHeader() {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">
          Open Deliveries Management
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-primary">
          Future Deliveries
        </h1>
        <p className="mt-1 text-sm text-tertiary">
          Manage future deliveries according to their operational status.
        </p>
      </div>

      <Link
        href="/future-deliveries/new"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90 focus:outline-none focus:ring-2 focus:ring-brand/20"
      >
        <Plus className="h-4 w-4" />
        New Future Delivery
      </Link>
    </header>
  );
}