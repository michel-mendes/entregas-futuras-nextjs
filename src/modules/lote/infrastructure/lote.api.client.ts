import { PaginatedResponse } from "@/types/pagination.types";
import { CriarLoteDTO } from "../application/lote.dto";
import { LoteRespostaApiDTO } from "../application/lote.dto";
import { ApiResponse } from "@/types/api-response.types";

interface FetchLoteParams {
    pagina: number;
    limite: number;
}

const extrairErro = (data: ApiResponse<LoteRespostaApiDTO>, mensagemPadrao: string) => {
    const msgErro = `${data.error?.message || ""}${(data.error?.details) ? `:\n${data.error.details}` : ""}`
    return new Error(msgErro || mensagemPadrao);
};

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
};

export async function criarLoteApi(dados: CriarLoteDTO): Promise<LoteRespostaApiDTO> {
    const response = await fetch("/api/lotes", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    });

    const result: ApiResponse<LoteRespostaApiDTO> = await response.json()

    if (!response.ok || !result.success) {
        throw extrairErro(result, 'Falha ao cadastrar o produto.');
    }
    return result.data!;
}