import { FutureDeliveryEntity, FutureDeliveryProps } from '../../domain/future-delivery.entity';
import { FutureDeliveryRepository } from '../../domain/future-delivery.repository';
import { CreateFutureDeliveryInput } from '../future-delivery.validator';

export class CreateFutureDeliveryUseCase {
    constructor(private readonly deliveryRepository: FutureDeliveryRepository) { }

    async execute(input: CreateFutureDeliveryInput): Promise<FutureDeliveryProps> {
        
        const deliveryEntity = new FutureDeliveryEntity({
            customer: input.customer,
            deliveryAddress: input.deliveryAddress,
            items: input.items.map(item => ({
                productId: item.productId,
                description: item.description,
                purchasedQuantity: item.purchasedQuantity,
                deliveredQuantity: item.deliveredQuantity || 0,
            })),
            createdAt: new Date(),
        });

        const createdFutureDelivery = await this.deliveryRepository.save(deliveryEntity);

        return createdFutureDelivery.toObject();
    }
}