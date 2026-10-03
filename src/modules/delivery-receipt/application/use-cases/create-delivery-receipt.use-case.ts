import { DeliveryReceiptEntity, DeliveryReceiptProps } from '../../domain/delivery-receipt.entity';
import { DeliveryReceiptRepository } from '../../domain/delivery-receipt.repository';
import { CreateDeliveryReceiptInput } from '../delivery-receipt.validator';

export class CreateDeliveryReceiptUseCase {
    constructor(private readonly deliveryReceiptRepository: DeliveryReceiptRepository) { }

    async execute(input: CreateDeliveryReceiptInput): Promise<DeliveryReceiptProps> {

        const receiptEntity = new DeliveryReceiptEntity({
            futureDeliveryId: input.futureDeliveryId,
            saleId: input.saleId,
            saleType: input.saleType,
            deliveryNumber: input.deliveryNumber,
            deliveryDate: input.deliveryDate,
            recipient: {
                name: input.recipient.name,
                address: input.recipient.address,
                phone: input.recipient.phone,
            },
            notes: input.notes,
            items: input.items.map((item) => ({
                productId: item.productId,
                batchId: item.batchId,
                quantity: item.quantity,
                itemNotes: item.itemNotes,
            })),
            createdAt: new Date(),
        });

        const createdReceipt = await this.deliveryReceiptRepository.save(receiptEntity);

        return createdReceipt.toObject();
    }
}