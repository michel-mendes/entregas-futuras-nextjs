import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBatchApi } from "@/modules/batch/infrastructure/batch.api.client";

export function useCreateBatch() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBatchApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batches", "search"] });
        }
    });
}