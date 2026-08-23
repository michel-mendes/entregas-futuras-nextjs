export interface BatchProps {
    id?: string;
    active: boolean;                    // Batch status (deactivated when stock reaches zero)
    productId: string;
    warehouseId: string;

    // Batch specifications
    productionDate?: Date;
    batchNumber?: string;
    gauge: number;
    shade: number;

    // Inventory control
    initialQuantity: number;           // Quantity received when the batch was created
    currentQuantity: number;           // Current physical stock quantity
    reservedQuantity: number;          // Quantity reserved for future delivery

    // Additional information
    detailedLocation?: string;         // Additional location details, e.g. "Aisle 3", "Mezzanine 2"
    notes?: string;                    // Additional notes, e.g. "Damaged box", "Clearance stock"

    createdAt: Date;
    updatedAt?: Date;
}

export class BatchEntity {
    // Immutable attributes
    private readonly _id?: string;
    private readonly _productId: string;
    private readonly _warehouseId: string;
    private readonly _initialQuantity: number;
    private readonly _createdAt: Date;

    // Mutable attributes
    private _active: boolean;
    private _productionDate?: Date;
    private _batchNumber?: string;
    private _gauge: number;
    private _shade: number;
    private _currentQuantity: number;
    private _reservedQuantity: number;
    private _detailedLocation?: string;
    private _notes?: string;
    private _updatedAt?: Date;

    constructor(props: BatchProps) {
        // Default values
        props.active ??= true;
        props.reservedQuantity ??= 0;
        props.createdAt ??= new Date();

        // Business rules
        if (props.currentQuantity < 0) {
            throw new Error("Current quantity cannot be negative.");
        }

        if (props.reservedQuantity < 0) {
            throw new Error("Reserved quantity cannot be negative.");
        }

        this._id = props.id;
        this._productId = props.productId;
        this._warehouseId = props.warehouseId;
        this._initialQuantity = props.initialQuantity;
        this._createdAt = props.createdAt;

        this._active = props.active;
        this._productionDate = props.productionDate;
        this._batchNumber = props.batchNumber;
        this._gauge = props.gauge;
        this._shade = props.shade;
        this._currentQuantity = props.currentQuantity;
        this._reservedQuantity = props.reservedQuantity;
        this._detailedLocation = props.detailedLocation;
        this._notes = props.notes;
        this._updatedAt = props.updatedAt;
    }

    get id(): string | undefined { return this._id }
    get active(): boolean { return this._active }
    get productId(): string { return this._productId }
    get warehouseId(): string { return this._warehouseId }
    get productionDate(): Date | undefined { return this._productionDate }
    get batchNumber(): string | undefined { return this._batchNumber }
    get gauge(): number { return this._gauge }
    get shade(): number { return this._shade }
    get initialQuantity(): number { return this._initialQuantity }
    get currentQuantity(): number { return this._currentQuantity }
    get reservedQuantity(): number { return this._reservedQuantity }
    get detailedLocation(): string | undefined { return this._detailedLocation }
    get notes(): string | undefined { return this._notes }
    get createdAt(): Date { return this._createdAt }
    get updatedAt(): Date | undefined { return this._updatedAt }

    // Calculated business rule
    get availableQuantity(): number {
        return this._currentQuantity - this._reservedQuantity;
    }

    // DOMAIN ACTIONS
    // These methods represent real business operations.

    /**
     * Reserves a quantity of the product for future delivery.
     * @param quantity Quantity to reserve. Must be greater than zero.
     */
    public reserve(quantity: number): void {
        if (quantity <= 0) {
            throw new Error("The quantity to reserve must be greater than zero.");
        }

        this._reservedQuantity += quantity;
        this.registerUpdate();
    }

    /**
     * Cancels a previously reserved quantity.
     * @param quantity Quantity to cancel. Must be greater than zero.
     */
    public cancelReservation(quantity: number): void {
        if (quantity <= 0) {
            throw new Error(
                "The quantity to cancel must be greater than zero."
            );
        }

        if (quantity > this._reservedQuantity) {
            throw new Error(
                "Cannot cancel more quantity than currently reserved."
            );
        }

        this._reservedQuantity -= quantity;
        this.registerUpdate();
    }

    /**
     * Registers a physical stock withdrawal.
     * @param quantity Quantity to withdraw from physical stock.
     */
    public registerPhysicalWithdrawal(quantity: number): void {
        if (quantity <= 0) {
            throw new Error(
                "The withdrawal quantity must be greater than zero."
            );
        }

        if (quantity > this.availableQuantity) {
            throw new Error(
                "Cannot withdraw more than the available stock."
            );
        }

        this._currentQuantity -= quantity;
        this._reservedQuantity -= quantity;

        // Deactivate the batch when the physical stock reaches zero.
        if (this._currentQuantity === 0) {
            this._active = false;
        }

        this.registerUpdate();
    }

    /**
     * Updates the additional details of the batch's physical location.
     * @param detailedLocation Additional physical location details.
     */
    public updateDetailedLocation(detailedLocation: string): void {
        if (!detailedLocation.trim()) {
            throw new Error("The new location cannot be empty.");
        }

        this._detailedLocation = detailedLocation.trim();
        this.registerUpdate();
    }

    private registerUpdate(): void {
        this._updatedAt = new Date();
    }

    public toObject(): BatchProps {
        return {
            id: this._id,
            active: this._active,
            productId: this._productId,
            warehouseId: this._warehouseId,
            productionDate: this._productionDate,
            batchNumber: this._batchNumber,
            gauge: this._gauge,
            shade: this._shade,
            initialQuantity: this._initialQuantity,
            currentQuantity: this._currentQuantity,
            reservedQuantity: this._reservedQuantity,
            detailedLocation: this._detailedLocation,
            notes: this._notes,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}