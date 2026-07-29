import { LoteEntity } from "../domain/lote.entity";

describe("LoteEntity", () => {

    const criarLoteValido = (quantidadeAtual: number = 100) => {
        const loteEntity = new LoteEntity({
            id: "lote-123",
            idProduto: "prod-123",
            idDeposito: "dep-123",
            bitola: 1,
            tonalidade: 1,
            quantidadeInicial: 100,
            quantidadeAtual,
            quantidadeReservada: 0
        });

        return loteEntity
    };

    describe("reservar()", () => {
        it("deve aumentar a quantidade reservada corretamente", () => {
            const lote = criarLoteValido();

            lote.reservar(20);
            
            expect(lote.quantidadeReservada).toBe(20);
            expect(lote.quantidadeAtual).toBe(100);
            expect(lote.quantidadeDisponivel).toBe(80);
        });

        it("deve lançar erro se tentar reservar quantidade negativa", () => {
            const lote = criarLoteValido();

            expect(() => lote.reservar(-5)).toThrow("A quantidade a ser reservada deve ser positiva.");
        });
    });

});