import { DeliveryReceiptRepository } from "../../domain/delivery-receipt.repository";
import { DeliveryReceiptProps } from "../../domain/delivery-receipt.entity";
import { DeliveryReceiptIdParam } from "../delivery-receipt.validator";
import { AppError } from "@/lib/errors/AppError";

export class GetDeliveryReceiptByIdUseCase {
    constructor(private readonly deliveryReceiptRepository: DeliveryReceiptRepository) { }

    async execute({ id }: DeliveryReceiptIdParam): Promise<DeliveryReceiptProps> {
        const receipt = await this.deliveryReceiptRepository.findById(id);

        if (!receipt) {
            throw AppError.NotFound(`Delivery receipt not found with id: ${id}`);
        }

        return receipt.toObject();
    };
}