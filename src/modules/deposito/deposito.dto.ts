export interface CreateDepositoDTO {
    nome: string;
    setor: string;
}

export interface UpdateDepositoDTO {
    nome: string;
    setor: string;
    ativo: boolean;
}