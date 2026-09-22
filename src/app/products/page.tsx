"use client";

import { useMemo, useState } from 'react'
import { useToast } from '@/components/ui/ToastNotifier'
import { useProducts, useToggleProductStatus } from '@/hooks/useProducts';
import { FriendlyCategoryData, getCategoryFriendlyNames, ProductCategory, ProductProps } from '@/modules/product/domain/product.entity';
import { ProductFilter, ProductStatusFilter } from '@/modules/product/domain/product.repository'
import Link from 'next/link';

export default function ProductsPage() {
    const { toastNotify } = useToast();

    const [draftFilters, setDraftFilters] = useState<ProductFilter>({
        page: 1,
        limit: 50,
        active: "ACTIVE"
    })
    const [filters, setFilters] = useState<ProductFilter>({ ...draftFilters });

    const productsQuery = useProducts(filters);
    const toggleProductStatusMutation = useToggleProductStatus();

    const products = productsQuery.data?.data ?? [];
    const metadata = productsQuery.data?.meta;
    const isLoading = productsQuery.isPending;

    const totalPages = metadata?.totalPaginas ?? 1;
    const currentPage = metadata?.paginaAtual ?? filters.page;

    const applyFilters = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFilters({ ...draftFilters })
    }

    const clearFilters = () => {
        const defaultFilters: ProductFilter = {
            limit: filters.limit,
            page: filters.page,
            active: "ACTIVE",
            category: "ALL",
            name: "",
            skuCode: ""
        }

        setDraftFilters({ ...defaultFilters });
        setFilters({ ...defaultFilters })
    }

    const changePage = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return;

        setDraftFilters({ ...draftFilters, page });
        setFilters({ ...filters, page });
    }

    const handleToggleProductStatus = (product: ProductProps) => {
        if (!product) return;

        const activate = !(product.active ?? true);

        toggleProductStatusMutation.mutate(
            {
                id: product.id!,
                activate
            },
            {
                onSuccess: () => {
                    toastNotify({
                        title: "Product status updated",
                        description: `"${product.name}" is now ${activate ? "active" : "inactive"}.`
                    })
                },
                onError: (error) => {
                    toastNotify({
                        title: "Unable to update status",
                        description: error.message,
                        variant: "destructive"
                    })
                }
            }
        );
    };

    const categoryNames = useMemo(() => {
        const categoriesList: FriendlyCategoryData[] = [{ name: "ALL", friendlyName: "All categories" }]
        categoriesList.push(...getCategoryFriendlyNames())

        return categoriesList;
    }, [])

    const totalProductsLabel = `Showing ${products.length} of ${metadata?.totalRegistros ?? 0} product${(metadata?.totalRegistros ?? 0) === 1 ? "" : "s"}`
    const pageLabel = useMemo(
        () => { return `Page ${currentPage} of ${Math.max(totalPages, 1)}` },
        [currentPage, totalPages]
    );

    return (
        <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                        Products Listing
                    </p>
                    <h1 className="mt-1 text-2xl font-semibold text-primary">
                        Products
                    </h1>
                    <p className="mt-1 text-sm text-tertiary">
                        Manage all products in this page.
                    </p>
                </div>

                <Link
                    href="products/new"
                    className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand/90"
                >
                    New product
                </Link>
            </header>

            {/* Filters section */}
            <section className="rounded-xl border border-border bg-surface p-4">
                <form
                    onSubmit={applyFilters}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6"
                >
                    <div>
                        <label
                            htmlFor="product-search-sku"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            SKU
                        </label>
                        <input
                            id='product-search-sku'
                            value={draftFilters.skuCode ?? ""}
                            onChange={event => setDraftFilters({ ...draftFilters, skuCode: event.target.value })}
                            placeholder="Search by SKU"
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='product-search-name'
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Name
                        </label>
                        <input
                            id='product-search-name'
                            value={draftFilters.name ?? ""}
                            onChange={event => setDraftFilters({ ...draftFilters, name: event.target.value })}
                            placeholder="Search by name"
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="product-search-category"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Category
                        </label>
                        <select
                            id="product-search-category"
                            value={draftFilters.category ?? "ALL"}
                            onChange={event => setDraftFilters({ ...draftFilters, category: (event.target.value as ProductCategory) })}
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        >
                            {
                                categoryNames.map(category => {
                                    return (
                                        <option key={category.name} value={`${category.name}`}>
                                            {category.friendlyName}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="product-search-status"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Status
                        </label>
                        <select
                            id="product-search-status"
                            value={draftFilters.active ?? ""}
                            onChange={event => setDraftFilters({ ...draftFilters, active: (event.target.value as ProductStatusFilter) })}
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        >
                            <option value="ALL">All statuses</option>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="product-search-results"
                            className="text-xs font-semibold uppercase tracking-wide text-tertiary"
                        >
                            Results
                        </label>
                        <select
                            id="product-search-results"
                            defaultValue={50}
                            value={draftFilters.limit ?? ""}
                            onChange={event => setDraftFilters({ ...draftFilters, limit: Number(event.target.value) })}
                            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        >
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="75">75</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    {/* Action buttons container */}
                    <div className="flex items-end gap-2">
                        <button
                            type='button'
                            onClick={clearFilters}
                            className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-subtle"
                        >
                            Clear
                        </button>
                        <button
                            type='submit'
                            className="flex-1 rounded-lg bg-secondary px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-primary"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </section>

            {productsQuery.isError ? (
                <div
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    role="alert"
                >
                    {productsQuery.error.message}
                </div>
            ) : null}

            {/* Products table section */}
            <section className="overflow-hidden rounded-xl border border-border bg-surface">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-secondary">
                        <caption className="sr-only">Products list</caption>

                        <thead className="border-b border-border bg-subtle text-xs uppercase text-tertiary">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">SKU</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Name</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Pay in full</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Installments</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                                <th scope="col" className="px-4 py-3 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-border">
                            {
                                isLoading
                                    ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-tertiary">
                                                Loading products...
                                            </td>
                                        </tr>
                                    )
                                    : products.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-6 text-center text-tertiary">
                                                No products found for the selected filters.
                                            </td>
                                        </tr>
                                    )
                                        : (
                                            products.map((product) => {
                                                const isActive = product.active ?? true;

                                                return (
                                                    <tr
                                                        key={product.skuCode ?? product.id}
                                                        className="transition hover:bg-subtle/50"
                                                    >
                                                        <td className="px-4 py-3 font-medium text-primary">{product.skuCode}</td>
                                                        <td className="px-4 py-3 text-primary">{product.name}</td>
                                                        <td className="px-4 py-3">{product.priceCash}</td>
                                                        <td className="px-4 py-3">{product.priceInstallments}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                                : "bg-gray-50 text-gray-700 border border-gray-200"
                                                                }`}>
                                                                {isActive ? "Active" : "Inactive"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link
                                                                    href={`products/${product.id}/edit`}
                                                                    className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-secondary transition hover:bg-subtle"
                                                                >
                                                                    Edit
                                                                </Link>
                                                                <button
                                                                    type='button'
                                                                    disabled={toggleProductStatusMutation.isPending}
                                                                    onClick={() => handleToggleProductStatus(product)}
                                                                    aria-label={`${isActive ? "Deactivate" : "Activate"}`}
                                                                    className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-secondary transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    {isActive ? "Deactivate" : "Activate"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        )
                            }
                        </tbody>
                    </table>
                </div>
            </section>

            <footer className="flex flex-col gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-secondary sm:flex-row sm:items-center sm:justify-between">
                {/* Products counter */}
                <span>{totalProductsLabel}</span>

                {/* Pagination */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span aria-live="polite">{pageLabel}</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={currentPage <= 1 || productsQuery.isFetching}
                            onClick={() => changePage(currentPage - 1)}
                            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages || productsQuery.isFetching}
                            onClick={() => changePage(currentPage + 1)}
                            className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-subtle disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </footer>
        </main>
    )
}