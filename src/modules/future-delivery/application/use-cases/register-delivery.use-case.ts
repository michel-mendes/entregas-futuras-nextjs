import { FutureDeliveryRepository } from "../../domain/future-delivery.repository";
import { RegisterPartialItemDeliveryInput } from "../future-delivery.validator";

export class RegisterDeliveryUseCase {
    constructor(private readonly deliveryRepository: FutureDeliveryRepository) { }

    async execute(deliveryId: string, input: RegisterPartialItemDeliveryInput): Promise<void> {
        
        const delivery = await this.deliveryRepository.findById(deliveryId);

        if (!delivery) {
            throw new Error(`Future delivery with ID ${deliveryId} not found.`);
        }

        delivery.registerPartialDelivery({ itemsToDeliver: input.itemsToDeliver });

        // 3. Persist the mutated state
        await this.deliveryRepository.save(delivery);
    }
}