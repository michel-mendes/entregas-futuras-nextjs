import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeLoteService } from "@/modules/lote/application/lote.service";
import { criarLoteSchemaValidacao, listarLotesSchemaValidacao } from "@/modules/lote/application/lote.validator";
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
});

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();
    
    // Validar payload
    const dadosValidados = criarLoteSchemaValidacao.parse(body);

    const serviceLote = makeLoteService();
    const resultado = await serviceLote.criarLote(dadosValidados);
    return sendSuccess(resultado, 201);
});