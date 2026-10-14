import { AppError } from '@/lib/errors/AppError';
import { FutureDeliveryProps } from '../../domain/future-delivery.entity';
import { FutureDeliveryRepository } from '../../domain/future-delivery.repository';

export class GetFutureDeliveryByIdUseCase {
    constructor(private readonly futureDeliveryRepository: FutureDeliveryRepository) { }

    async execute(id: string): Promise<FutureDeliveryProps> {
        const futureDelivery = await this.futureDeliveryRepository.findById(id);

        if (!futureDelivery) {
            throw AppError.NotFound(`Future delivery not found with id: ${id}`);
        }
        
        return futureDelivery.toObject();
    }
}