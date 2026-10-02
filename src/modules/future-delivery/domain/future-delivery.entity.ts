export enum FutureDeliveryStatus {
    PENDING = 'PENDING',
    PARTIAL = 'PARTIAL',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface FutureDeliveryItemProps {
    id?: string;
    productId: string;
    description: string;
    purchasedQuantity: number;
    deliveredQuantity: number;
}

export interface PartialDeliveryItemProps {
    productId: string;
    quantityToDeliver: number;
}

interface RegisterPartialDeliveryArgs {
    itemsToDeliver: PartialDeliveryItemProps[];
}

export interface CustomerProps {
    name: string;
    document: string;
    phone: string;
}

export interface DeliveryAddressProps {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
}

export interface FutureDeliveryProps {
    id?: string;
    customer: CustomerProps;
    deliveryAddress: DeliveryAddressProps;
    status?: FutureDeliveryStatus;
    items: FutureDeliveryItemProps[];
    createdAt: Date;
    updatedAt?: Date;
}

export class FutureDeliveryEntity {
    private readonly _id?: string;
    private _customer: CustomerProps;
    private _deliveryAddress: DeliveryAddressProps;
    private _status: FutureDeliveryStatus;
    private _items: FutureDeliveryItemProps[];
    private readonly _createdAt: Date;
    private _updatedAt?: Date;

    constructor(data: FutureDeliveryProps) {
        this.validateData(data);

        this._id = data.id;
        this._customer = data.customer;
        this._deliveryAddress = data.deliveryAddress;
        this._items = data.items;
        this._createdAt = data.createdAt;
        this._updatedAt = data.updatedAt;

        this._status = data.status || this.evaluateStatus();
    }

    get id(): string | undefined { return this._id; }
    get customer(): CustomerProps { return this._customer; }
    get deliveryAddress(): DeliveryAddressProps { return this._deliveryAddress; }
    get status(): FutureDeliveryStatus { return this._status; }
    get items(): FutureDeliveryItemProps[] { return [...this._items]; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | undefined { return this._updatedAt; }



    // Virtual getters | not saved in database
    get totalPurchasedItems(): number {
        return this._items.reduce((acc, item) => acc + item.purchasedQuantity, 0);
    }

    get totalDeliveredItems(): number {
        return this._items.reduce((acc, item) => acc + item.deliveredQuantity, 0);
    }

    get progressPercentage(): number {
        if (this.totalPurchasedItems === 0) return 0;
        const progress = (this.totalDeliveredItems / this.totalPurchasedItems) * 100;
        return Number(progress.toFixed(2));
    }



    // Domain Methods
    public updateDeliveryAddress(newAddress: DeliveryAddressProps): void {
        this.validateAddress(newAddress);
        this._deliveryAddress = newAddress;
        this.setUpdateTime();
    }

    public registerPartialDelivery({ itemsToDeliver }: RegisterPartialDeliveryArgs): void {
        if (this._status === FutureDeliveryStatus.CANCELLED) {
            throw new Error('Cannot deliver items for a cancelled delivery.');
        }

        if (itemsToDeliver.length === 0) {
            throw new Error('There must be at least one item to deliver.');
        }

        for (const i in itemsToDeliver) {
            const productId = itemsToDeliver[i].productId;
            const quantityToDeliver = itemsToDeliver[i].quantityToDeliver;
            const itemIndex = this._items.findIndex(item => item.productId === productId)

            if (itemIndex === -1) {
                throw new Error('Product not found in this delivery.');
            }

            if (quantityToDeliver <= 0) {
                throw new Error('Quantity to deliver must be greater than zero.');
            }

            const item = this._items[itemIndex];
            const newDeliveredTotal = item.deliveredQuantity + quantityToDeliver;

            if (newDeliveredTotal > item.purchasedQuantity) {
                throw new Error(`Cannot deliver ${quantityToDeliver}. Exceeds purchased quantity for product ${item.description}.`);
            }

            this._items[itemIndex].deliveredQuantity = newDeliveredTotal;
        }

        this._status = this.evaluateStatus();
        this.setUpdateTime();
    }

    public cancelFutureDelivery(): void {
        if (this._status === FutureDeliveryStatus.COMPLETED) {
            throw new Error('Cannot cancel an already completed delivery.');
        }

        this._status = FutureDeliveryStatus.CANCELLED;
        this.setUpdateTime();
    }

    public toObject(): FutureDeliveryProps & {
        progressPercentage: number;
        totalPurchasedItems: number;
        totalDeliveredItems: number;
    } {
        return {
            id: this._id,
            customer: this._customer,
            deliveryAddress: this._deliveryAddress,
            status: this._status,
            items: this.items,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,

            progressPercentage: this.progressPercentage,
            totalPurchasedItems: this.totalPurchasedItems,
            totalDeliveredItems: this.totalDeliveredItems
        };
    }



    // Private Helper Methods
    private validateData(data: FutureDeliveryProps): void {
        if (!data.customer || !data.customer.document || !data.customer.name) {
            throw new Error('Customer information (name and document) is required.');
        }

        this.validateAddress(data.deliveryAddress);

        if (!data.items || data.items.length === 0) {
            throw new Error('A future delivery must have at least one item.');
        }

        data.items.forEach(item => {
            if (item.purchasedQuantity <= 0) {
                throw new Error(`Purchased quantity for ${item.description} must be strictly positive.`);
            }
            if (item.deliveredQuantity < 0) {
                throw new Error(`Delivered quantity for ${item.description} cannot be negative.`);
            }
            if (item.deliveredQuantity > item.purchasedQuantity) {
                throw new Error(`Delivered quantity cannot exceed purchased quantity for ${item.description}.`);
            }
        });
    }

    private validateAddress(address: DeliveryAddressProps): void {
        if (!address || !address.zipCode || !address.street || !address.number || !address.city || !address.state) {
            throw new Error('Incomplete delivery address. ZipCode, Street, Number, City and State are mandatory.');
        }
    }

    private evaluateStatus(): FutureDeliveryStatus {
        if (this.totalDeliveredItems === 0) {
            return FutureDeliveryStatus.PENDING;
        }

        if (this.totalDeliveredItems === this.totalPurchasedItems) {
            return FutureDeliveryStatus.COMPLETED;
        }

        return FutureDeliveryStatus.PARTIAL;
    }

    private setUpdateTime(): void {
        this._updatedAt = new Date();
    }
}