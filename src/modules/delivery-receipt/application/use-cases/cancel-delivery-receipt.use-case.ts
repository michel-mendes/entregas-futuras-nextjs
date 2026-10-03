import { DeliveryReceiptEntity, DeliveryReceiptProps } from '../../domain/delivery-receipt.entity';
import { DeliveryReceiptRepository } from '../../domain/delivery-receipt.repository';
import { DeliveryReceiptIdParam } from '../delivery-receipt.validator';

export class CancelDeliveryReceiptUseCase {
    constructor(private readonly deliveryReceiptRepository: DeliveryReceiptRepository) { }

    async execute({ id }: DeliveryReceiptIdParam): Promise<DeliveryReceiptProps> {

        const cancelledReceipt = await this.deliveryReceiptRepository.cancel(id);

        if (!cancelledReceipt) {
            throw new Error(`Delivery receipt with ID ${id} not found.`);
        }

        return cancelledReceipt.toObject();
    }
}