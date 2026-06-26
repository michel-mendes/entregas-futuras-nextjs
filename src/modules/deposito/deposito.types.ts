export interface IDeposito {
    nome: string;   // Ex: "Depósito 01", "Depósito Avenida"...
    setor: string;  // Ex: "Meio", "Parede Leste", "A5"...
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}