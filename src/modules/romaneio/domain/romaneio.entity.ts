export enum StatusRomaneio {
    CRIADO = "CRIADO",
    CONCLUIDO = "CONCLUIDO",
    CANCELADO = "CANCELADO"
};

export interface IDestinatario {
    nome: string,
    telefone: string,
    endereco: string
};

export interface IItemRomaneioProps {
    id: string,
    idProduto: string,
    idLote?: string,
    quantidade: number,
    observacoesItem?: string
};

export interface IRomaneioProps {
    id?: string;
    idEntregaFutura: string;
    idVenda: string;
    tipoVenda: string;
    numeroEntrega: string;
    dataEntrega: Date;
    destinatario: IDestinatario;
    status: StatusRomaneio;
    observacoes?: string;
    itens: IItemRomaneioProps[];
    createdAt: Date;
    updatedAt?: Date;
};

export class RomaneioEntity {
    private readonly _id?: string;
    private readonly _idEntregaFutura: string;
    private readonly _idVenda: string;
    private readonly _createdAt: Date;
    private _tipoVenda: string;
    private _numeroEntrega: string;
    private _dataEntrega: Date;
    private _destinatario: IDestinatario;
    private _status: StatusRomaneio;
    private _observacoes?: string;
    private _itens: IItemRomaneioProps[];
    private _updatedAt?: Date;

    constructor(props: IRomaneioProps, id?: string) {
        this._id = id || props.id;
        this._idEntregaFutura = props.idEntregaFutura;
        this._idVenda = props.idVenda;
        this._createdAt = props.createdAt || new Date();

        this._tipoVenda = props.tipoVenda;
        this._numeroEntrega = props.numeroEntrega;
        this._dataEntrega = props.dataEntrega;
        this._destinatario = props.destinatario;
        this._status = props.status || StatusRomaneio.CRIADO;
        this._observacoes = props.observacoes;
        this._itens = props.itens || [];
        this._updatedAt = props.updatedAt;

        this.validate();
    }

    get id(): string | undefined { return this._id };
    get idEntregaFutura(): string { return this._idEntregaFutura };
    get idVenda(): string { return this._idVenda };
    get createdAt(): Date { return this._createdAt };
    get tipoVenda(): string { return this._tipoVenda };
    get numeroEntrega(): string { return this._numeroEntrega };
    get dataEntrega(): Date { return this._dataEntrega };
    get destinatario(): IDestinatario { return this._destinatario };
    get status(): StatusRomaneio { return this._status };
    get observacoes(): string { return this._observacoes || "" };
    get itens(): ReadonlyArray<IItemRomaneioProps> { return Object.freeze([...this._itens]) };
    get updatedAt(): Date | undefined { return this._updatedAt };

    public adicionarItem(item: IItemRomaneioProps): void {
        if (this._status !== StatusRomaneio.CRIADO) throw new Error("Não é possível adicionar itens a um romaneio que não está no status 'CRIADO'.");
        if (item.quantidade <= 0) throw new Error("A quantidade do item deve ser maior que zero.");

        this._itens.push(item);
        this.registrarAlteracao();
    };

    public concluir(): void {
        if (this._status !== StatusRomaneio.CRIADO) {
            throw new Error(`Transição de estado inválida: romaneio em status ${this._status} não pode ser concluído.`);
        };

        this._status = StatusRomaneio.CONCLUIDO;
        this.registrarAlteracao();
    };

    public cancelar(): void {
        if (this._status === StatusRomaneio.CANCELADO) {
            throw new Error("O romaneio já está cancelado.");
        };

        this._status = StatusRomaneio.CANCELADO;
        this.registrarAlteracao();
    };

    private registrarAlteracao(): void {
        this._updatedAt = new Date();
    };

    private validate(): void {
        if (!this._idEntregaFutura) throw new Error("idEntregaFutura é obrigatório.");
        if (!this._destinatario || this._destinatario.endereco.trim().length < 1) throw new Error("Endereço do destinatário é obrigatório.");
        if (!this._destinatario || this._destinatario.nome.trim().length < 1) throw new Error("Nome do destinatário é obrigatório.");
        if (!this._itens || this._itens.length === 0) throw new Error("Não é possível criar um romaneio sem itens para entregar.")
    };

    public toObject(): IRomaneioProps {
        return {
            id: this._id,
            idEntregaFutura: this._idEntregaFutura,
            idVenda: this._idVenda,
            tipoVenda: this._tipoVenda,
            numeroEntrega: this._numeroEntrega,
            dataEntrega: this._dataEntrega,
            destinatario: this._destinatario,
            status: this._status,
            observacoes: this._observacoes,
            itens: this._itens,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    };
};