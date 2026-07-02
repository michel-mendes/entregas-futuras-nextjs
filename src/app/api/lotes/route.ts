import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeLoteService } from "@/modules/lote/application/lote.service";
import { listarLotesSchemaValidacao } from "@/modules/lote/application/lote.validator";
import { NextRequest } from "next/server";

export const GET = apiWrapper(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);

    // Validação dos parâmetros de busca na URL
    const queryValidada = listarLotesSchemaValidacao.parse({
        pagina: searchParams.get("pagina"),
        limite: searchParams.get("limite")
    });

    // Instanciar o serviço e executar a ação
    const serviceLote = makeLoteService();
    const resultado = await serviceLote.listarLotes(queryValidada);

    return sendSuccess(resultado.data, 200, resultado.meta)
})