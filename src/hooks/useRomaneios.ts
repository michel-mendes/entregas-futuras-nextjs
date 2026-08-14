import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchRomaneios } from "@/modules/romaneio/infrastructure/romaneio.api.client";
import { ListarRomaneiosParams } from "@/modules/romaneio/domain/romaneio.repository";

export function useRomaneios({limite = 10, pagina = 1, status}: ListarRomaneiosParams) {
    const result = useQuery({
        queryKey: ["romaneios", "listagem", pagina, limite, status],
        queryFn: () => fetchRomaneios({limite, pagina, status}),
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5,
    });

    return result;
}