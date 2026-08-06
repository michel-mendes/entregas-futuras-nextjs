import { StatusRomaneio, IDadosDestinatario, IItemRomaneio } from "../romaneio.types";

export interface IItemRomaneioEntity {
    id: string,
    idProduto: string,
    idLote?: string,
    quantidade: number,
    observacoesItem?: string
};

interface ConstrutorRomaneioProps {
    id: string,
    idEntregaFutura: string,
    idVenda: string,
    tipoVenda: string,
    numeroEntrega: string,
    dataEntrega: Date,
    destinatario: IDadosDestinatario,
    status?: StatusRomaneio,
    obervacoes?: string,
    itens?: IItemRomaneioEntity[],
    createdAt?: Date,
    updatedAt?: Date,
};

export class RomaneioEntity {
    readonly id: string;
    readonly idEntregaFutura: string;
    readonly idVenda: string;
    readonly createdAt: Date;

    private _tipoVenda: string;
    private _numeroEntrega: string;
    private _dataEntrega: Date;
    private _destinatario: IDadosDestinatario;
    private _status: StatusRomaneio;
    private _observacoes?: string;
    private _itens: IItemRomaneioEntity[];
    private _updatedAt?: Date;

    constructor(props: ConstrutorRomaneioProps) {
        if (!props.idEntregaFutura) throw new Error("idEntregaFutura é obrigatório.");
        if (!props.destinatario || !props.destinatario.endereco) throw new Error("Endereço do destinatário é obrigatório.");
        if (!props.itens || props.itens.length === 0) throw new Error("Não é possível criar um romaneio sem itens para entregar.")

        this.id = props.id;
        this.idEntregaFutura = props.idEntregaFutura;
        this.idVenda = props.idVenda;
        this.createdAt = props.createdAt || new Date();

        this._tipoVenda = props.tipoVenda;
        this._numeroEntrega = props.numeroEntrega;
        this._dataEntrega = props.dataEntrega;
        this._destinatario = props.destinatario;
        this._status = props.status || StatusRomaneio.CRIADO;
        this._observacoes = props.obervacoes;
        this._itens = props.itens || [];
        this._updatedAt = props.updatedAt;
    };

    get tipoVenda(): string { return this._tipoVenda };
    get numeroEntrega(): string { return this._numeroEntrega };
    get dataEntrega(): Date { return this._dataEntrega };
    get destinatario(): IDadosDestinatario { return this._destinatario };
    get status(): StatusRomaneio { return this._status };
    get observacoes(): string { return this._observacoes || "" };
    get itens(): ReadonlyArray<IItemRomaneioEntity> { return Object.freeze([...this._itens]) };
    get updatedAt(): Date | undefined { return this._updatedAt };

    public adicionarItem(item: IItemRomaneioEntity): void {
        if (this._status !== StatusRomaneio.CRIADO) {
            throw new Error("Não é possível adicionar itens a um romaneio que não está no status 'CRIADO'.");
        };

        if (item.quantidade <= 0) {
            throw new Error("A quantidade do item deve ser maior que zero.");
        };

        this._itens.push(item);
        this.registrarAlteracao();
    }

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
};