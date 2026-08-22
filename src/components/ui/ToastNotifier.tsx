"use client";

/* ==========================================================================
 * How to use
 *
 * 1 - import { Toaster } from '../components/ui/ToastNotifier' inside `src/app/layout.tsx`
 * 2 - Inside `RootLayout` insert `<Toaster />` below `{children}`
 * 3 - import { useToast } from "../../../components/ui/ToastNotifier"; into the page that the toastNotify will be called
 * 4 - declare `const { toastNotify } = useToast();` inside the caller component
 * 5 - call the notification using `toastNotify({title, description, variant?})`
 * 
 * ========================================================================== */
/*import { Toaster } from '../components/ui/ToastNotifier';*/

import { useCallback, useEffect, useState, type ReactNode, } from "react";

/* ==========================================================================
 * Configuration
 * ========================================================================== */

const TOAST_DURATION = 5000;


/* ==========================================================================
 * Types
 * ========================================================================== */

export type ToastVariant = "default" | "destructive";

export type ToastOptions = {
    id?: string;
    title: string;
    description?: ReactNode;
    variant?: ToastVariant;
    duration?: number;
};

export type ToastItem = Required<
    Pick<ToastOptions, "id" | "title" | "variant" | "duration">
> & {
    description?: ReactNode;
};

type ToastStoreListener = (toasts: ToastItem[]) => void;

type ToastProps = {
    toast: ToastItem;
    onDismiss: (id: string) => void;
};


/* ==========================================================================
 * Toast Store
 * ========================================================================== */

let toastCounter = 0;
let toastItems: ToastItem[] = [];

const listeners = new Set<ToastStoreListener>();


/* ==========================================================================
 * Toast Store Helpers
 * ========================================================================== */

function createToastId(): string {
    toastCounter += 1;

    return `toast-${Date.now()}-${toastCounter}`;
}

function notifyListeners(): void {
    for (const listener of listeners) {
        listener([...toastItems]);
    }
}

function addToast(options: ToastOptions): ToastItem {
    const toast: ToastItem = {
        id: options.id ?? createToastId(),
        title: options.title,
        description: options.description,
        variant: options.variant ?? "default",
        duration: options.duration ?? TOAST_DURATION,
    };

    toastItems = [...toastItems, toast];

    notifyListeners();

    return toast;
}

function removeToast(id: string): void {
    toastItems = toastItems.filter((toast) => toast.id !== id);

    notifyListeners();
}

function clearToasts(): void {
    toastItems = [];

    notifyListeners();
}


/* ==========================================================================
 * Public Toast API
 * ========================================================================== */

export function toastNotify(options: ToastOptions): {
    id: string;
    dismiss: () => void;
} {
    const item = addToast(options);

    return {
        id: item.id,
        dismiss: () => removeToast(item.id),
    };
}


/* ==========================================================================
 * Toast Hook
 * ========================================================================== */

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>(toastItems);

    useEffect(() => {
        const listener: ToastStoreListener = (nextToasts) => {
            setToasts(nextToasts);
        };

        listeners.add(listener);

        setToasts([...toastItems]);

        return () => {
            listeners.delete(listener);
        };
    }, []);

    const dismiss = useCallback((id: string) => {
        removeToast(id);
    }, []);

    const dismissAll = useCallback(() => {
        clearToasts();
    }, []);

    return {
        toasts,
        toastNotify,
        dismiss,
        dismissAll,
    };
}


/* ==========================================================================
 * Toast Component
 * ========================================================================== */

function Toast({ toast: item, onDismiss }: ToastProps) {
    const isDestructive = item.variant === "destructive";

    useEffect(() => {
        if (item.duration <= 0) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            onDismiss(item.id);
        }, item.duration);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [item.duration, item.id, onDismiss]);

    const toastClassName = [
        "pointer-events-auto w-full max-w-sm rounded-xl border p-4 shadow-lg",
        "transition-all duration-200",
        isDestructive
            ? "border-red-200 bg-red-50 text-red-950"
            : "border-border bg-surface text-primary",
    ].join(" ");

    const descriptionClassName = [
        "mt-1 text-sm",
        isDestructive ? "text-red-800" : "text-secondary",
    ].join(" ");

    const dismissButtonClassName = [
        "rounded-md p-1 text-lg leading-none transition",
        isDestructive
            ? "text-red-700 hover:bg-red-100"
            : "text-tertiary hover:bg-subtle",
    ].join(" ");

    return (
        <div
            role={isDestructive ? "alert" : "status"}
            aria-live={isDestructive ? "assertive" : "polite"}
            className={toastClassName}
        >
            <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                        {item.title}
                    </p>

                    {item.description ? (
                        <div className={descriptionClassName}>
                            {item.description}
                        </div>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={() => onDismiss(item.id)}
                    aria-label="Dismiss notification"
                    className={dismissButtonClassName}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
        </div>
    );
}


/* ==========================================================================
 * Toast Container
 * ========================================================================== */

export function Toaster() {
    const { toasts, dismiss } = useToast();

    return (
        <div
            aria-label="Notifications"
            className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:inset-x-auto sm:right-6 sm:w-auto"
        >
            {toasts.map((item) => (
                <Toast
                    key={item.id}
                    toast={item}
                    onDismiss={dismiss}
                />
            ))}
        </div>
    );
}