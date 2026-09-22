export enum ProductCategory {
  FLOOR_TILE = 'FLOOR_TILE',            // Piso cerâmico
  PORCELAIN_TILE = 'PORCELAIN_TILE',    // Porcelanato
  MORTAR = 'MORTAR',                    // Argamassa
  GROUT = 'GROUT',                      // Rejunte
  GENERAL = 'GENERAL',                  // Geral
};

export interface PackageData {
  weightKg?: number;
  areaM2?: number;
}

interface UpdatePricesProps {
  priceCost?: number,
  priceCash?: number,
  priceInstallments?: number
}

export interface ProductProps {
  id?: string;
  skuCode: string;
  name: string;
  imageUrl?: string | undefined;
  priceCost: number;
  priceCash: number;
  priceInstallments: number;
  category: ProductCategory;
  active: boolean;
  packageData?: PackageData;
  createdAt: Date;
  updatedAt?: Date | undefined;
  deletedAt?: Date | undefined;
}

export class ProductEntity {
  private readonly _id?: string;
  private _skuCode: string;
  private _name: string;
  private _imageUrl?: string | undefined;
  private _priceCost: number;
  private _priceCash: number;
  private _priceInstallments: number;
  private _category: ProductCategory;
  private _active: boolean;
  private _packageData?: PackageData;
  private readonly _createdAt: Date;
  private _updatedAt?: Date | undefined;
  private _deletedAt?: Date | undefined;

  constructor(data: ProductProps) {
    this.validateData(data);

    this._id = data.id;
    this._skuCode = data.skuCode;
    this._name = data.name;
    this._imageUrl = data.imageUrl;
    this._priceCost = data.priceCost;
    this._priceCash = data.priceCash;
    this._priceInstallments = data.priceInstallments;
    this._category = data.category;
    this._active = data.active;
    this._packageData = data.packageData;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
    this._deletedAt = data.deletedAt;
  }

  // Getters
  get id(): string | undefined { return this._id }
  get skuCode(): string { return this._skuCode }
  get name(): string { return this._name }
  get imageUrl(): string | undefined { return this._imageUrl }
  get priceCost(): number { return this._priceCost }
  get priceCash(): number { return this._priceCash }
  get priceInstallments(): number { return this._priceInstallments }
  get category(): ProductCategory { return this._category }
  get active(): boolean { return this._active }
  get packageData(): PackageData | undefined { return this._packageData }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date | undefined { return this._updatedAt }
  get deletedAt(): Date | undefined { return this._deletedAt }

  // Domain methods
  public activate(): void {
    this._active = true;
    this.setUpdateTime();
  }

  public deactivate(): void {
    this._active = false;
    this.setUpdateTime();
  }

  public updatePrices({ priceCost, priceCash, priceInstallments }: UpdatePricesProps): void {
    const prices = { priceCost, priceCash, priceInstallments };

    for (const [name, value] of Object.entries(prices)) {
      if (value !== undefined && value < 0) {
        validatePrice(name, value);
      }
    }

    if (priceCost !== undefined) this._priceCost = priceCost;
    if (priceCash !== undefined) this._priceCash = priceCash;
    if (priceInstallments !== undefined) this._priceInstallments = priceInstallments;

    this.setUpdateTime();
  }

  public updateDescription(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Description cannot be empty.');
    }
    this._name = name.trim();
    this.setUpdateTime();
  }

  public updateSkuCode(skuCode: string): void {
    if (!skuCode || skuCode.trim().length === 0) {
      throw new Error('SKU code cannot be empty.');
    }
    this._skuCode = skuCode.trim();
    this.setUpdateTime();
  }

  public updateImageUrl(url: string | undefined): void {
    this._imageUrl = url;
    this.setUpdateTime();
  }

  public updateCategory(category: ProductCategory): void {
    const requiresPackage =
      category === ProductCategory.FLOOR_TILE ||
      category === ProductCategory.PORCELAIN_TILE;

    if (requiresPackage) {
      if (
        !this._packageData ||
        this._packageData.weightKg === undefined ||
        this._packageData.areaM2 === undefined
      ) {
        throw new Error(
          'Package data (WeightKg and AreaM2) is required for FLOOR_TILE and PORCELAIN_TILE categories.'
        );
      }
    }

    this._category = category;
    this.setUpdateTime();
  }

  public updatePackageData(packageData: PackageData | undefined): void {
    if (packageData) {
      if (packageData.weightKg !== undefined && packageData.weightKg <= 0) {
        throw new Error('WeightKg must be positive when provided.');
      }
      if (packageData.areaM2 !== undefined && packageData.areaM2 <= 0) {
        throw new Error('AreaM2 must be positive when provided.');
      }
    }

    this._packageData = packageData;
    this.setUpdateTime();
  }

  public delete(): void {
    this._active = false;
    this._deletedAt = new Date();
    this.setUpdateTime();
  }

  public toObject(): ProductProps {
    return {
      id: this._id,
      skuCode: this._skuCode,
      name: this._name,
      imageUrl: this._imageUrl,
      priceCost: this._priceCost,
      priceCash: this._priceCash,
      priceInstallments: this._priceInstallments,
      category: this._category,
      active: this._active,
      packageData: this._packageData,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt
    };
  }

  private validateData(data: ProductProps): void {
    if (!data.skuCode || data.skuCode.trim().length === 0) {
      throw new Error('SKU code is required.');
    }
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Product name is required.');
    }
    if (data.priceCost < 0 || data.priceCash < 0 || data.priceInstallments < 0) {
      throw new Error('Prices cannot be negative.');
    }
    if (!Object.values(ProductCategory).includes(data.category)) {
      throw new Error('Invalid product category.');
    }
    if ((data.category === ProductCategory.FLOOR_TILE || data.category === ProductCategory.PORCELAIN_TILE) && (!data.packageData || data.packageData.weightKg === undefined || data.packageData.areaM2 === undefined)) {
      throw new Error('Package data (weight and area) is required for FLOOR TILE and PORCELAIN TILE categories.');
    }
  }

  private setUpdateTime(): void {
    this._updatedAt = new Date();
  }
}


// Helpers
function validatePrice(propName: string, value: number): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${propName} must be a valid non-negative number.`);
  }
}

export interface FriendlyCategoryData {
    name: string; //e.g.: "PORCELAIN_TILE", "FLOOR_TILE", "GENERAL"...
    friendlyName: string; //e.g.: "Porcelain Tile", "Floor Tile", "General"...
}

export function getCategoryFriendlyNames() {
  const categoriesList: FriendlyCategoryData[] = []

  for (const category in ProductCategory) {
    categoriesList.push({
      name: category,
      friendlyName: category
        .replaceAll("_", " ")
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    })
  }

  return categoriesList
}