import { PaginatedResponse } from "@/types/pagination.types";
import { DeliveryReceiptRepository, DeliveryReceiptFilter } from "../../domain/delivery-receipt.repository";
import { DeliveryReceiptProps } from "../../domain/delivery-receipt.entity";

export class FindAllDeliveryReceiptsUseCase {
    constructor(private readonly deliveryReceiptRepository: DeliveryReceiptRepository) { }

    async execute(query: DeliveryReceiptFilter): Promise<PaginatedResponse<DeliveryReceiptProps>> {
        const filter = {
            page: query.page,
            limit: query.limit,
            futureDeliveryId: query.futureDeliveryId,
            saleId: query.saleId,
            deliveryNumber: query.deliveryNumber,
            recipientName: query.recipientName,
            status: query.status,
            startDate: query.startDate,
            endDate: query.endDate,
        };

        const result = await this.deliveryReceiptRepository.findAll(filter);
        const receipts = result.data.map(entity => entity.toObject());

        return {
            data: receipts,
            meta: {
                totalPaginas: result.totalPages,
                totalRegistros: result.totalRecords,
                paginaAtual: query.page,
                itensPorPagina: query.limit,
                temPaginaAnterior: query.page < result.totalPages,
                temProximaPagina: query.page > 1
            }
        };
    };
}