import { PaginatedResponse } from "@/types/pagination.types";
import { LoteRespostaApiDTO } from "../application/lote.dto";

interface FetchLoteParams {
    pagina: number;
    limite: number;
}

export async function fetchLotes({limite, pagina}: FetchLoteParams): Promise<PaginatedResponse<LoteRespostaApiDTO>> {
    const url = new URL("/api/lotes", window.location.origin)

    url.searchParams.append("pagina", pagina.toString());
    url.searchParams.append("limite", limite.toString());

    const response = await fetch(url.toString());

    if (!response) {
        throw new Error("Falha ao buscar listem de lotes");
    }

    const json: PaginatedResponse<LoteRespostaApiDTO> = await response.json()
    return json;
}