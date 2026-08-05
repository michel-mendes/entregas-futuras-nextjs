import { useMutation, useQueryClient } from "@tanstack/react-query";
import { criarLoteApi } from "@/modules/lote/infrastructure/lote.api.client";

export function useCriarLote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: criarLoteApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lotes", "listagem"] });
        }
    });
}