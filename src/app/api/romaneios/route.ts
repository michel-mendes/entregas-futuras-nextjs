import { apiWrapper, sendSuccess } from "@/lib/api/route-wrapper";
import { makeRomaneioService } from "@/modules/romaneio/application/romaneio.service";
import { createRomaneioValidationSchema, listarRomaneiosValidationSchema } from "@/modules/romaneio/presentation/romaneio.validation";
import { NextRequest } from "next/server";

const serviceRomaneios = makeRomaneioService();

export const GET = apiWrapper(async (req: NextRequest) => {
    const params = Object.fromEntries( new URL(req.url).searchParams );
    const queryValidada = listarRomaneiosValidationSchema.parse(params);

    const resultado = await serviceRomaneios.listarRomaneios(queryValidada);

    return sendSuccess(resultado.data, 200, resultado.meta)
});

export const POST = apiWrapper(async (req: NextRequest) => {
    const body = await req.json();
    const dadosValidados = createRomaneioValidationSchema.parse(body);

    const resultado = await serviceRomaneios.criarRomaneio(dadosValidados);
    return sendSuccess(resultado, 201);
});