interface ConstrutorLoteProps {
    id: string,
    idProduto: string,
    idDeposito: string,
    ativo?: boolean,
    dataProducao?: Date,
    numeroLote?: string,
    bitola: number,
    tonalidade: number,
    quantidadeInicial: number,
    quantidadeAtual: number,
    quantidadeReservada?: number,
    localizacaoDetalhada?: string,
    observacoes?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export class LoteEntity {
    // Atributos que não podem ser modificados
    readonly id: string;
    readonly idProduto: string;
    readonly idDeposito: string;
    readonly quantidadeInicial: number;
    readonly createdAt: Date;

    // Atributos que podem ser lidos e modificados
    private _ativo: boolean;
    private _dataProducao?: Date;
    private _numeroLote?: string;
    private _bitola: number;
    private _tonalidade: number;
    private _quantidadeAtual: number;
    private _quantidadeReservada: number;
    private _localizacaoDetalhada?: string;
    private _observacoes?: string;
    private _updatedAt?: Date;

    constructor(atributos: ConstrutorLoteProps) {
        // Validação de atributos padão não passados
        if (!atributos.ativo) atributos.ativo = true;
        if (!atributos.quantidadeReservada) atributos.quantidadeReservada = 0;
        if (!atributos.createdAt) atributos.createdAt = new Date();

        // Regras de negócio
        if (atributos.quantidadeAtual < 0) throw new Error("A quantidade atual não pode ser negativa.");
        if (atributos.quantidadeReservada < 0) throw new Error("A quantidade reservada não pode ser negativa.");

        // A regra abaixo varia de acordo com o negócio, deixarei comentado pois ela pode existir ou não
        // Exemplo: Uma venda pode ser feita sem o produto em estoque físico pois o cliente pode aguardar o prazo de pedido
        // if (atributos.quantidadeReservada > atributos.quantidadeAtual) throw new Error("A quantidade reservada não pode exceder a quantidade física disponível.");

        this.id = atributos.id;
        this.idDeposito = atributos.idDeposito;
        this.idProduto = atributos.idProduto;
        this.quantidadeInicial = atributos.quantidadeInicial;
        this.createdAt = atributos.createdAt;
        this._ativo = atributos.ativo;
        this._dataProducao = atributos.dataProducao;
        this._numeroLote = atributos.numeroLote;
        this._bitola = atributos.bitola;
        this._tonalidade = atributos.tonalidade;
        this._quantidadeAtual = atributos.quantidadeAtual;
        this._quantidadeReservada = atributos.quantidadeReservada;
        this._localizacaoDetalhada = atributos.localizacaoDetalhada;
        this._observacoes = atributos.observacoes;
        this._updatedAt = atributos.updatedAt;
    }

    get ativo(): boolean { return this._ativo };
    get quantidadeAtual(): number { return this._quantidadeAtual };
    get quantidadeReservada(): number { return this._quantidadeReservada };
    get dataProducao(): Date | undefined { return this._dataProducao };
    get numeroLote(): string | undefined { return this._numeroLote };
    get bitola(): number { return this._bitola };
    get tonalidade(): number { return this._tonalidade };
    get localizacaoDetalhada(): string | undefined { return this._localizacaoDetalhada };
    get observacoes(): string | undefined { return this._observacoes };
    get updatedAt(): Date | undefined { return this._updatedAt };

    // Regra de negócio calculada
    get quantidadeDisponivel(): number {
        const qtdeDisponivel = this._quantidadeAtual - this._quantidadeReservada;

        return qtdeDisponivel
    }

    // AÇÕES DE DOMÍNIO
    // Esses métodos representam ações reais do negócio

    /**
     * Registra quantidade do produto que deve ser reservada para entrega futura.
     * @param quantidade Quantidade a ser reservada. Não pode ser menor que zero.
     */
    public reservar(quantidade: number): void {
        if (quantidade <= 0) throw new Error("A quantidade a ser reservada deve ser positiva.");

        // Dependendo do negócio essa regra pode não existir, no meu caso manterei comentado
        // if (quantidade > this.quantidadeDisponivel) throw new Error(`Estoque para reservar insuficiente. Disponível: ${this.quantidadeDisponivel}, Solicitado: ${quantidade}`);

        this._quantidadeReservada += quantidade;
        this.registrarDataAlteracao();
    }

    /**
     * Registra cancelamento de quantidade já reservada.
     * @param quantidade Quantidade a ser reservada. Não pode ser menor que zero.
     */
    public cancelarReserva(quantidade: number): void {
        if (quantidade <= 0) throw new Error("A quantidade a ser cancelada deve ser positiva.");

        if (quantidade > this._quantidadeReservada) throw new Error(`Não é possível cancelar quantidade maior que a reserva atual.`);

        this._quantidadeReservada -= quantidade;
        this.registrarDataAlteracao();
    }

    /**
     * Registra a baixa no estoque físico.
     * @param quantidade Quantidade a ser retirada do estoque.
     */
    public registrarSaidaFisica(quantidade: number): void {
        if (quantidade <= 0) throw new Error("A quantidade de saída deve ser positiva.");
        if (quantidade > this.quantidadeDisponivel) throw new Error(`Não é possível dar saída sem estoque disponível.`);

        this._quantidadeAtual -= quantidade;
        this._quantidadeReservada -= quantidade;

        // Desativar lote caso o estoque tenha acabado (regra de negócio)
        if (this._quantidadeAtual === 0) {
            this._ativo = false;
        }

        this.registrarDataAlteracao();
    }

    /**
     * Registra novo detalhamento complementar da localização física do lote.
     * @param novaLocalizacaoDetalhada Detalhamento complementar da localização física do lote.
     */
    public atualizarLocalizacaoDetalhada(novaLocalizacaoDetalhada: string): void {
        if (!novaLocalizacaoDetalhada.trim()) throw new Error("A nova localização não pode estar vazia.");
        
        this._localizacaoDetalhada = novaLocalizacaoDetalhada.trim();
        this.registrarDataAlteracao();
    }

    private registrarDataAlteracao(): void {
        this._updatedAt = new Date();
    }
}