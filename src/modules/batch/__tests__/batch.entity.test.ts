import { BatchEntity } from "../domain/batch.entity";

describe("BatchEntity", () => {

    const createValidBatch = (currentQuantity: number = 100) => {
        const batchEntity = new BatchEntity({
            productId: "produto-123",
            warehouseId: "armazem-456",
            currentQuantity: currentQuantity,
            reservedQuantity: 0,
            initialQuantity: 100,
            gauge: 10,
            shade: 5,
            productionDate: new Date(),
            batchNumber: "lote-789",
            detailedLocation: "Localização detalhada",
            notes: "Notas do lote",
            active: true,
            createdAt: new Date()
        });

        return batchEntity
    };

    describe("reserve()", () => {
        it("must increase the reserved quantity correctly", () => {
            const batch = createValidBatch();

            batch.reserve(20);
            
            expect(batch.reservedQuantity).toBe(20);
            expect(batch.currentQuantity).toBe(100);
            expect(batch.availableQuantity).toBe(80);
        });

        it("must throw an error if trying to reserve a negative quantity", () => {
            const batch = createValidBatch();

            expect(() => batch.reserve(-5)).toThrow("Quantity to reserve must be a positive number.");
        });
    });

});