export enum CategoriaProduto {
    PISO = 'PISO',
    PORCELANATO = 'PORCELANATO',
    ARGAMASSA = 'ARGAMASSA',
    REJUNTE = 'REJUNTE',
    GERAL = 'GERAL',
}

export interface IProduto {
    _id?: string;
    codigoSKU: string; // Código do produto utilizado no sistema legado, pode-se referir à barras ou código de barras
    descricao: string;
    urlImagem?: string | undefined;
    precoVista: number;
    precoPrazo: number;
    categoria: CategoriaProduto;
    ativo: boolean;

    // Campos específicos para pisos, porcelanatos, argamassas e rejuntes
    pesoEmbalagemKg?: number;
    m2Embalagem?: number;

    createdAt?: Date;
    updatedAt?: Date;
}