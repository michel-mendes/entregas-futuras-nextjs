'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function NewFutureDeliveryHeader() {
    const router = useRouter();

    return (
        <div className="flex items-center gap-3">
            <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-border text-secondary hover:text-primary hover:border-brand-border transition-all cursor-pointer"
                aria-label="Go back"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
                <h1 className="text-lg font-semibold text-primary">Register Future Delivery</h1>
                <p className="text-xs text-tertiary">Warehouse & Logistics Module</p>
            </div>
        </div>
    );
}