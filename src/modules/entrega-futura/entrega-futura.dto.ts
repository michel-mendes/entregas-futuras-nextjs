// DTOs para entrada e alteração de dados
export interface CreateItemEntregaDTO {
    produtoId: string;
    descricao: string;
    quantidadeComprada: number;
}

export interface CreateEntregaFuturaDTO {
    cliente: {
        nome: string;
        documento: string;
        telefone: string;
    };
    enderecoEntrega: {
        cep: string;
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        cidade: string;
        uf: string;
    };
    itens: CreateItemEntregaDTO[];
}

export interface UpdateItemEntregaDTO {
    itemId: string;
    quantidadeEntregue: number;
}

// DTOs para saídas de dados (respostas da API)
export interface ItemEntregaResponseDTO {
    id: string;
    produtoId: string;
    descricao: string;
    quantidadeComprada: number;
    quantidadeEntregue: number;
    pendente: number;
}

export interface EntregaFuturaResponseDTO {
    id: string;
    cliente: {
        nome: string;
        documento: string;
        telefone: string;
    };
    enderecoEntrega: string; // Endereço formatado para o front-end. Ex: "rua tal, 999 (jardim tal) - cidade/UF"
    status: string;
    progressoPercentual: number;
    totalPecasCompradas: number;
    totalPecasEntregues: number;
    itens: ItemEntregaResponseDTO[];
    dataCriacao: string;
}