export enum DeliveryReceiptStatus {
    CREATED = 'CREATED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface DeliveryReceiptRecipientProps {
    name: string;
    address: string;
    phone?: string;
}

export interface DeliveryReceiptItemProps {
    id?: string;
    productId: string;
    batchId?: string;
    quantity: number;
    itemNotes?: string;
}

export interface DeliveryReceiptProps {
    id?: string;
    futureDeliveryId: string;
    saleId: string;
    saleType: string;
    deliveryNumber: string;
    deliveryDate: Date;
    recipient: DeliveryReceiptRecipientProps;
    status?: DeliveryReceiptStatus;
    notes?: string;
    items: DeliveryReceiptItemProps[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class DeliveryReceiptEntity {
    private readonly _id?: string;
    private readonly _futureDeliveryId: string;
    private readonly _saleId: string;
    private readonly _createdAt: Date;
    private _saleType: string;
    private _deliveryNumber: string;
    private _deliveryDate: Date;
    private _recipient: DeliveryReceiptRecipientProps;
    private _status: DeliveryReceiptStatus;
    private _notes?: string;
    private _items: DeliveryReceiptItemProps[];
    private _updatedAt?: Date;

    constructor(props: DeliveryReceiptProps) {
        this.validateData(props);

        this._id = props.id;
        this._futureDeliveryId = props.futureDeliveryId;
        this._saleId = props.saleId;
        this._saleType = props.saleType;
        this._deliveryNumber = props.deliveryNumber;
        this._deliveryDate = props.deliveryDate;
        this._recipient = props.recipient;
        this._notes = props.notes;
        this._items = props.items || [];
        this._createdAt = props.createdAt || new Date();
        this._updatedAt = props.updatedAt;
        this._status = props.status || DeliveryReceiptStatus.CREATED;
    }

    // Getters
    get id(): string | undefined { return this._id; }
    get futureDeliveryId(): string { return this._futureDeliveryId; }
    get saleId(): string { return this._saleId; }
    get saleType(): string { return this._saleType; }
    get deliveryNumber(): string { return this._deliveryNumber; }
    get deliveryDate(): Date { return this._deliveryDate; }
    get recipient(): DeliveryReceiptRecipientProps { return this._recipient; }
    get status(): DeliveryReceiptStatus { return this._status; }
    get notes(): string { return this._notes || ''; }
    get items(): ReadonlyArray<DeliveryReceiptItemProps> { return [...this._items]; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | undefined { return this._updatedAt; }

    // Domain Methods
    public addItem(item: DeliveryReceiptItemProps): void {
        if (this._status !== DeliveryReceiptStatus.CREATED) {
            throw new Error("Cannot add items to a delivery receipt that is not in 'CREATED' status.");
        }
        if (item.quantity <= 0) {
            throw new Error('Item quantity must be greater than zero.');
        }

        this._items.push(item);
        this.setUpdateTime();
    }

    public complete(): void {
        if (this._status !== DeliveryReceiptStatus.CREATED) {
            throw new Error(`Invalid state transition: delivery receipt with status ${this._status} cannot be completed.`);
        }

        this._status = DeliveryReceiptStatus.COMPLETED;
        this.setUpdateTime();
    }

    public cancel(): void {
        if (this._status === DeliveryReceiptStatus.CANCELLED) {
            throw new Error('The delivery receipt is already cancelled.');
        }

        this._status = DeliveryReceiptStatus.CANCELLED;
        this.setUpdateTime();
    }

    public toObject(): DeliveryReceiptProps {
        return {
            id: this._id,
            futureDeliveryId: this._futureDeliveryId,
            saleId: this._saleId,
            saleType: this._saleType,
            deliveryNumber: this._deliveryNumber,
            deliveryDate: this._deliveryDate,
            recipient: this._recipient,
            status: this._status,
            notes: this._notes,
            items: [...this._items],
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }

    // Private Helper Methods
    private validateData(props: DeliveryReceiptProps): void {
        if (!props.futureDeliveryId) {
            throw new Error('futureDeliveryId is required.');
        }

        if (!props.recipient || !props.recipient.name || props.recipient.name.trim().length === 0) {
            throw new Error('Recipient name is required.');
        }

        if (!props.recipient.address || props.recipient.address.trim().length === 0) {
            throw new Error('Recipient address is required.');
        }

        if (!props.items || props.items.length === 0) {
            throw new Error('Cannot create a delivery receipt without items.');
        }
    }

    private setUpdateTime(): void {
        this._updatedAt = new Date();
    }
}