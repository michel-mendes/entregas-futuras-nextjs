import { connectToDatabase } from '@/lib/db/mongoose';
import { Produto } from '@/models/produto.model';
import { IProduto } from '@/types/produto.types';
import { CreateProdutoInput, ListarProdutosInput } from '@/dtos/produto.dto';

export class ProdutoRepository {

    async findById(id: string) {
        await connectToDatabase();
        
        return Produto.findById(id).lean();
    }

    async findBySKU(sku: string): Promise<IProduto | null> {
        await connectToDatabase();

        return Produto.findOne({ codigoSKU: sku }).lean();
    }

    async findAllPaginated(params: ListarProdutosInput) {
        await connectToDatabase();

        const { page, limit, termoBusca, apenasAtivos } = params;

        const query: Record<string, any> = {};

        if (apenasAtivos !== undefined) {
            query.ativo = apenasAtivos;
        }

        if (termoBusca) {
            
            // Faz busca por todas as palavras no termoBusca independente da ordem
            let regexSearch: string | RegExp = termoBusca
            if (termoBusca !== "") {
                const palavras = termoBusca.split(/\s+/);
                regexSearch = new RegExp(palavras.map(palavra => `(?=.*${palavra})`).join(""), "i");
            }

            query.$or = [
                { codigoSKU: { $regex: regexSearch } },
                { descricao: { $regex: regexSearch } }
            ];
        }

        const skip = (page - 1) * limit;

        // Execução simultânea: Conta o total e busca os dados
        const [dados, totalRegistros] = await Promise.all([
            Produto.find(query)
                .sort({ createdAt: -1 }) // Mais recentes primeiro
                .skip(skip)
                .limit(limit)
                .lean(),
            Produto.countDocuments(query)
        ]);

        return { dados, totalRegistros };
    }

    async create(data: CreateProdutoInput): Promise<IProduto> {
        await connectToDatabase();

        return Produto.create(data);
    }

    async update(id: string, data: Partial<IProduto>) {
        await connectToDatabase();

        return Produto.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    }

    async softDelete(id: string) {
        await connectToDatabase();

        return Produto.findByIdAndUpdate(id, { ativo: false }, { new: true }).lean();
    }
}

export const produtoRepository = new ProdutoRepository();