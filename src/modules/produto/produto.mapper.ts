import { IProduto } from './produto.types';

export class ProdutoMapper {

    // Transforma o retorno sujo do banco de dados no contrato limpo da API
    static toHttp(produtoRaw: any) {

        // Remover o _id e o __v para descartá-los e enviar para o frontend somente os dados realmente necessários e padronizados
        const { _id, __v, ...dadosLimpos } = produtoRaw;

        const produtoLimpo: IProduto = {
            id: _id,
            ...dadosLimpos
        };

        return produtoLimpo;
    }

    // Facilita o mapeamento de arrays inteiros (usado na listagem)
    static toHttpArray(produtosRaw: any[]) {
        return produtosRaw.map(produto => this.toHttp(produto));
    }
}