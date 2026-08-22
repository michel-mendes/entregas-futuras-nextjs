"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultValues,
    FieldErrors,
    useForm,
} from "react-hook-form";
import { useEffect } from "react";
import Link from "next/link";

import {
    createWarehouseValidationSchema,
    updateWarehouseValidationSchema,
    CreateWarehouseDTO,
    UpdateWarehouseDTO,
} from "@/modules/warehouse/presentation/warehouse.validation";

type WarehouseFormValues = CreateWarehouseDTO | UpdateWarehouseDTO;

type WarehouseFormProps<TFormValues extends WarehouseFormValues> = {
    mode: "create" | "edit";
    defaultValues: DefaultValues<TFormValues>;
    isSubmitting: boolean;
    serverError?: string | null;
    onSubmit: (values: TFormValues) => void;
};

const inputClassName =
    "mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-primary outline-none transition placeholder:text-tertiary focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60";

function FieldError({
    errors,
    name,
}: {
    errors: FieldErrors<WarehouseFormValues>;
    name: "name" | "sector";
}) {
    const message = errors[name]?.message;

    if (typeof message !== "string") {
        return null;
    }

    return (
        <p className="mt-1 text-xs text-red-600" role="alert">
            {message}
        </p>
    );
}

export function WarehouseForm<TFormValues extends WarehouseFormValues>({
    mode,
    defaultValues,
    isSubmitting,
    serverError,
    onSubmit,
}: WarehouseFormProps<TFormValues>) {
    const schema =
        mode === "create"
            ? createWarehouseValidationSchema
            : updateWarehouseValidationSchema;

    const form = useForm<TFormValues>({
        resolver: zodResolver(schema) as never,
        defaultValues,
        mode: "onBlur",
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    const submit = (values: TFormValues) => {
        onSubmit(values);
    };

    return (
        <form
            onSubmit={handleSubmit(submit)}
            className="space-y-6"
            noValidate
        >
            {serverError ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                >
                    {serverError}
                </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="warehouse-name"
                        className="text-sm font-medium text-primary"
                    >
                        Warehouse name
                    </label>

                    <input
                        id="warehouse-name"
                        type="text"
                        autoComplete="organization"
                        placeholder="e.g. Main Distribution Center"
                        disabled={isSubmitting}
                        className={inputClassName}
                        {...register("name" as never)}
                    />

                    <FieldError
                        errors={errors as FieldErrors<WarehouseFormValues>}
                        name="name"
                    />
                </div>

                <div>
                    <label
                        htmlFor="warehouse-sector"
                        className="text-sm font-medium text-primary"
                    >
                        Sector
                    </label>

                    <input
                        id="warehouse-sector"
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. Cold Storage"
                        disabled={isSubmitting}
                        className={inputClassName}
                        {...register("sector" as never)}
                    />

                    <FieldError
                        errors={errors as FieldErrors<WarehouseFormValues>}
                        name="sector"
                    />
                </div>
            </div>

            {mode === "create" ? (
                <label className="flex items-center gap-3 text-sm text-secondary">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                        disabled={isSubmitting}
                        {...register("isActive" as never)}
                    />
                    Create warehouse as active
                </label>
            ) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-5 sm:flex-row sm:justify-end">
                <Link
                    href="/warehouses"
                    className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-secondary transition hover:bg-subtle"
                >
                    Cancel
                </Link>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting
                        ? "Saving..."
                        : mode === "create"
                            ? "Create warehouse"
                            : "Save changes"}
                </button>
            </div>
        </form>
    );
}

// export type { CreateWarehouseDTO, UpdateWarehouseDTO };