'use client';

import { useRouter } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';

interface FormActionsProps {
    isSubmitting: boolean;
    hasItems: boolean;
}

export function NewFutureDeliveryFormActions({ isSubmitting, hasItems }: FormActionsProps) {
    const router = useRouter();

    return (
        <div className="flex justify-end gap-3 pt-2">
            <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-border bg-surface text-secondary hover:bg-subtle transition-all cursor-pointer"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isSubmitting || !hasItems}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-brand hover:bg-brand/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        Register Delivery
                    </>
                )}
            </button>
        </div>
    );
}