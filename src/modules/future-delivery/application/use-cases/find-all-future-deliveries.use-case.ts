import { PaginatedResponse } from "@/types/pagination.types";
import { FutureDeliveryRepository, FutureDeliveryFilter } from "../../domain/future-delivery.repository";
import { FutureDeliveryProps } from "../../domain/future-delivery.entity";

export class FindAllFutureDeliveriesUseCase {
    constructor(private readonly deliveryRepository: FutureDeliveryRepository) { }

    async execute(query: FutureDeliveryFilter): Promise<PaginatedResponse<FutureDeliveryProps>> {

        const filter = {
            page: query.page,
            limit: query.limit,
            customerName: query.customerName,
            customerDocument: query.customerDocument,
            status: query.status,
            startDate: query.startDate,
            endDate: query.endDate,
        };

        const result = await this.deliveryRepository.findAll(filter);
        const deliveries = result.data.map(entity => entity.toObject());

        return {
            data: deliveries,
            meta: {
                totalPaginas: result.totalPages,
                totalRegistros: result.totalRecords,
                paginaAtual: query.page,
                itensPorPagina: query.limit,
                temPaginaAnterior: query.page < result.totalPages,
                temProximaPagina: query.page > 1,
            }
        };
    }
}