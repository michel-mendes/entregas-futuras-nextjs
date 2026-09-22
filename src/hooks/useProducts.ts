import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { CreateProductInput, UpdateProductInput } from "@/modules/product/application/product.validator";
import { ProductFilter } from "@/modules/product/domain/product.repository";
import { productsApi } from "@/modules/product/presentation/product.api";

export function useProducts(params: ProductFilter) {
    const queryParams: ProductFilter = {
        ...params,
        page: params.page || 1,
        limit: params.limit || 10,
    };

    return useQuery<Awaited<ReturnType<typeof productsApi.fetchProducts>>, Error>({
        queryKey: ["products", "list", queryParams],
        queryFn: () => productsApi.fetchProducts(queryParams),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    })
};

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof productsApi.createProduct>>, Error, CreateProductInput>({
            mutationFn: (productData) => productsApi.createProduct(productData),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["products", "list"] });
            }
        })
};

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof productsApi.updateProduct>>,
        Error,
        { id: string, productData: UpdateProductInput }
    >({
        mutationFn: ({ id, productData }) => productsApi.updateProduct(id, productData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", "list"] });
        }
    })
};

export function useToggleProductStatus() {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof productsApi.toggleProductStatus>>,
        Error,
        { id: string, activate: boolean }
    >({
        mutationFn: ({ id, activate }) => productsApi.toggleProductStatus(id, activate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products", "list"] });
        }
    })
};