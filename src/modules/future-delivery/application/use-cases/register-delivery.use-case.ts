import { FutureDeliveryRepository } from "../../domain/future-delivery.repository";
import { DeliveryReceiptRepository } from "@/modules/delivery-receipt/domain/delivery-receipt.repository";
import { CreateDeliveryReceiptInput } from "@/modules/delivery-receipt/application/delivery-receipt.validator";
import { FutureDeliveryProps, PartialDeliveryItemProps } from "../../domain/future-delivery.entity";
import { DeliveryReceiptEntity, DeliveryReceiptProps } from "@/modules/delivery-receipt/domain/delivery-receipt.entity";
import mongoose, { ClientSession } from "mongoose";

export type FutureDeliveryFulfilledReceiptProps = FutureDeliveryProps & {
    deliveryReceipt: DeliveryReceiptProps
};

export class RegisterDeliveryAndIssueDeliveryReceiptUseCase {
    constructor(
        private readonly deliveryRepository: FutureDeliveryRepository,
        private readonly deliveryReceiptRepository: DeliveryReceiptRepository
    ) { }

    async execute(deliveryId: string, input: CreateDeliveryReceiptInput): Promise<FutureDeliveryFulfilledReceiptProps> {
        const session: ClientSession = await mongoose.startSession();
        session.startTransaction();

        try {
            // Future delivery management.
            // 01 - Get the future delivery.
            const futureDelivery = await this.deliveryRepository.findById(deliveryId, { session });
            const itemsToDeliver: PartialDeliveryItemProps[] = [];

            if (!futureDelivery) {
                throw new Error(`Future delivery with ID ${deliveryId} not found.`)
            }

            // 02 - Maps the delivery receipt items and register the partial/total delivery.
            for (const item of input.items) {
                itemsToDeliver.push({
                    itemId: item.itemId,
                    productId: item.productId,
                    quantityToDeliver: item.quantity
                });
            };
            futureDelivery.registerPartialDelivery({itemsToDeliver});

            // 03 - Saves the future delivery changes.
            await this.deliveryRepository.save(futureDelivery, { session });



            // Delivery receipts management.
            // 04 - creates the delivery receipt entity
            const receiptEntity: DeliveryReceiptEntity = new DeliveryReceiptEntity({
                futureDeliveryId: input.futureDeliveryId,
                saleId: input.saleId,
                saleType: input.saleType,
                deliveryNumber: input.deliveryNumber,
                deliveryDate: input.deliveryDate,
                recipient: { ...input.recipient },
                notes: input.notes,
                items: input.items.map(item => ({
                    productId: item.productId,
                    batchId: item.batchId,
                    quantity: item.quantity,
                    itemNotes: item.itemNotes
                })),
                createdAt: new Date()
            });

            // 05 - saves the created delivery receipt
            const savedDeliveryReceipt = await this.deliveryReceiptRepository.save(receiptEntity, { session });

            // 06 - All operations went ok, now we need to commit them.
            await session.commitTransaction();
            await session.endSession();

            return { ...futureDelivery.toObject(), deliveryReceipt: { ...savedDeliveryReceipt.toObject() } }
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();

            console.log("\n\n\nSegue detalhes do erro -> ", error)
            throw new Error(`Failed to process delivery and generate receipt. Please try again.`)
        }
    }
}