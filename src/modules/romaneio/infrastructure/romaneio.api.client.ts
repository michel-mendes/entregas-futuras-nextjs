import { PaginatedResponse } from "@/types/pagination.types";
import { IRomaneioProps } from "../domain/romaneio.entity";
import { CreateRomaneioDTO } from "../presentation/romaneio.validation";
import { ListarRomaneiosParams } from "../domain/romaneio.repository";

export async function fetchRomaneios({limite, pagina, status}: ListarRomaneiosParams): Promise<PaginatedResponse<IRomaneioProps>> {
    const url = new URL("/api/romaneios", window.location.origin);

    url.searchParams.append("pagina", pagina.toString());
    url.searchParams.append("limite", limite.toString());

    if (status && status !== "TODOS") url.searchParams.append("status", status);

    const response = await fetch(url.toString());
    if (!response) throw new Error("Falha ao buscar romaneios, tente novamente mais tarde.");

    const json: PaginatedResponse<IRomaneioProps> = await response.json();
    return json;
};

export async function criarRomaneioApi(dados: CreateRomaneioDTO): Promise<IRomaneioProps> {
    const response = await fetch("/api/romaneios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    const result = await response.json();
    
    if (!response.ok || !result.success) {
        throw new Error("Falha ao cadastrar romaneio. Tente novamente mais tarde.");
        // throw extrairErro(result, 'Falha ao cadastrar o produto.');
    }
    return result.data!;
}