import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBatchApi } from "@/modules/lote/infrastructure/lote.api.client";

export function useCriarLote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBatchApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lotes", "listagem"] });
        }
    });
}