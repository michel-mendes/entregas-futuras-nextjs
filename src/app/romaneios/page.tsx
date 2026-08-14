"use client";

import { useRomaneios } from "@/hooks/useRomaneios";
import { StatusRomaneio } from "@/modules/romaneio/domain/romaneio.entity";
import { ListarRomaneiosParams } from "@/modules/romaneio/domain/romaneio.repository";
import { useState } from "react";

export default function RomaneiosPage() {
    const [buscaParams, setBuscaParams] = useState<ListarRomaneiosParams>({
        limite: 10, 
        pagina: 1,
        // status: StatusRomaneio.CANCELADO
    })

    const { data, isLoading, isError, error } = useRomaneios(buscaParams)

    if (isLoading) return <div>Carregando romaneios... Por favor aguarde</div>
    if (isError) return <div>Houve um erro ao carregar romaneios: {error.message}</div>

    return (
        <main>
            <input type="text" list="listaStatus" />
            
            <select name="status" id="listaStatus" onChange={(e) => {setBuscaParams({...buscaParams, status: e.currentTarget.value as StatusRomaneio})}}>
                <option value={StatusRomaneio.CRIADO}>Criado</option>
                <option value={StatusRomaneio.CONCLUIDO}>Concluído</option>
                <option value={StatusRomaneio.CANCELADO}>Cancelado</option>
                <option value="TODOS">Todos</option>
            </select>
            <table>
                <thead>
                    <tr>
                        <th>ID Venda</th>
                        <th>Data entrega</th>
                        <th>Nome Cliente</th>
                        <th>Endereço</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        (data && data.data)
                        ? data.data.map(romaneio => (
                            <tr key={romaneio.id}>
                                <td>{romaneio.idVenda}</td>
                                <td>{new Date(romaneio.dataEntrega).toLocaleString()}</td>
                                <td>{romaneio.destinatario.nome}</td>
                                <td>{romaneio.destinatario.endereco}</td>
                            </tr>
                        ))
                        : <pre>{JSON.stringify(data, undefined, 4)}</pre>
                    }
                </tbody>
            </table>
        </main>
    )
}