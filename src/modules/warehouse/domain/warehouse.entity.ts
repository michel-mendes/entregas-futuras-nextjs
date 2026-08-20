export interface IWarehouseProps {
    id?: string;
    name: string;
    sector: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class WarehouseEntity {
    private readonly _id?: string;
    private readonly _createdAt: Date;
    private _name: string;
    private _sector: string;
    private _isActive: boolean;
    private _updatedAt?: Date;

    constructor(props: IWarehouseProps) {
        this._id = props.id;
        this._createdAt = props.createdAt || new Date();

        this._name = props.name;
        this._sector = props.sector;
        this._isActive = props.isActive ?? true;
        this._updatedAt = props.updatedAt;

        this.validate();
    }

    get id(): string | undefined { return this._id; }
    get name(): string { return this._name; }
    get sector(): string { return this._sector; }
    get isActive(): boolean { return this._isActive; }
    get createdAt(): Date { return this._createdAt; }
    get updatedAt(): Date | undefined { return this._updatedAt; }

    public activate(): void {
        if (this._isActive) {
            throw new Error("Warehouse is already active.");
        }

        this._isActive = true;
        this.registerChange();
    }

    public deactivate(): void {
        if (!this._isActive) {
            throw new Error("Warehouse is already inactive.");
        }

        this._isActive = false;
        this.registerChange();
    }

    public updateDetails(name: string, sector: string): void {
        this._name = name;
        this._sector = sector;
        this.registerChange();
    }

    private registerChange(): void {
        this._updatedAt = new Date();
    }

    private validate(): void {
        if (!this._name || this._name.trim().length === 0) {
            throw new Error("Name is required.");
        }
        if (!this._sector || this._sector.trim().length === 0) {
            throw new Error("Sector is required.");
        }
    }

    public toObject(): IWarehouseProps {
        return {
            id: this._id,
            name: this._name,
            sector: this._sector,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt
        };
    }
}