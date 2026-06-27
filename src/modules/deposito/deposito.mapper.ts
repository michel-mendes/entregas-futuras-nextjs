import { DepositoEntity } from "./deposito.entity";

export class DepositoMapper {
    /**
    * Converte um objeto do banco de dados (Mongoose Document ou Lean Object)
    * em uma Entidade de Domínio pura.
    */
    static toDomain(raw: any): DepositoEntity {
        if (!raw) {
            throw new Error("Falha no mapeamento do modelo 'Deposito': dados do depósito nulos ou indefinidos.");
        }

        return {
            id: raw._id ? raw._id.toString() : raw.id?.toString(),
            ativo: Boolean(raw.ativo),
            nome: raw.nome,
            setor: raw.setor,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        };
    }

    /**
    * Converte filtros do domínio para a sintaxe de query do MongoDB.
    */
    static toDatabaseQuery(filtros: Partial<DepositoEntity>): Record<string, any> {
        const query: Record<string, any> = {};
        
        if (filtros.id) query._id = filtros.id; // Converte a busca por ID de "id" para "_id"

        // Case insensitive para buscas de texto
        if (filtros.nome) query.nome = new RegExp(filtros.nome, "i");
        if (filtros.setor) query.setor = new RegExp(filtros.setor, "i");

        if (filtros.ativo !== undefined) query.ativo = filtros.ativo;

        return query;
    }
}