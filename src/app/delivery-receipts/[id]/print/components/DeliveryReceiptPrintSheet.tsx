import { CheckSquare } from "lucide-react";
import { DeliveryReceiptProps } from "@/modules/delivery-receipt/domain/delivery-receipt.entity";

interface DeliveryReceiptPrintSheetProps {
    receipt: DeliveryReceiptProps;
    storeInfo?: {
        name: string;
        address: string;
        phone: string;
        email: string;
    };
}

export function DeliveryReceiptPrintSheet({
    receipt,
    storeInfo = {
        name: "BUILDING MATERIALS & FINISHES CO.",
        address: "123 Commercial Blvd, Suite 100 — Industrial Park",
        phone: "(555) 019-2834",
        email: "dispatch@materials-store.com",
    },
}: DeliveryReceiptPrintSheetProps) {
    const formattedDeliveryDate = receipt.deliveryDate
        ? new Date(receipt.deliveryDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        })
        : "-";

    const formattedCreatedDate = receipt.createdAt
        ? new Date(receipt.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "-";

    return (
        <div className="mx-auto my-6 w-[148mm] min-h-[210mm] bg-white p-6 text-black shadow-lg print:m-0 print:w-full print:min-h-0 print:p-0 print:shadow-none print:bg-transparent">
            {/* Estilos CSS específicos para forçar página A5 no navegador */}
            <style jsx global>{`
        @page {
          size: A5 portrait;
          margin: 8mm;
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

            {/* HEADER: STORE INFO & DOCUMENT TITLE */}
            <header className="border-b-2 border-black pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-base font-extrabold tracking-tight text-black uppercase">
                            {storeInfo.name}
                        </h1>
                        <p className="text-[10px] text-gray-700">{storeInfo.address}</p>
                        <p className="text-[10px] text-gray-700">
                            Tel: {storeInfo.phone} | {storeInfo.email}
                        </p>
                    </div>

                    <div className="text-right">
                        <h2 className="text-sm font-black uppercase tracking-wider text-black">
                            DELIVERY RECEIPT
                        </h2>
                        <p className="text-xs font-bold text-black mt-0.5">
                            #{receipt.deliveryNumber}
                        </p>
                    </div>
                </div>
            </header>

            {/* DOCUMENT METADATA GRID */}
            <section className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded border border-black p-2">
                    <p className="text-[9px] font-bold uppercase text-gray-600">
                        DELIVER TO (RECIPIENT)
                    </p>
                    <p className="font-bold text-black">{receipt.recipient.name}</p>
                    <p className="text-gray-800 leading-tight">{receipt.recipient.address}</p>
                    {receipt.recipient.phone && (
                        <p className="mt-1 text-gray-800">Phone: {receipt.recipient.phone}</p>
                    )}
                </div>

                <div className="rounded border border-black p-2 space-y-1">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Delivery Date:</span>
                        <span className="font-bold text-black">{formattedDeliveryDate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Order / Sale #:</span>
                        <span className="font-bold text-black">{receipt.saleId || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Sale Type:</span>
                        <span className="font-semibold uppercase text-black">
                            {receipt.saleType}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Issued At:</span>
                        <span className="text-gray-800">{formattedCreatedDate}</span>
                    </div>
                </div>
            </section>

            {/* ITEMS TABLE */}
            <section className="mt-4">
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr className="border-y-2 border-black bg-gray-100 uppercase text-left">
                            <th className="py-1.5 px-1 font-bold">Item / Code</th>
                            <th className="py-1.5 px-1 font-bold">Batch #</th>
                            <th className="py-1.5 px-1 font-bold text-center">Qty</th>
                            <th className="py-1.5 px-1 font-bold">Notes / Specs</th>
                            <th className="py-1.5 px-1 font-bold text-center w-12">Rec.</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300 border-b-2 border-black">
                        {receipt.items && receipt.items.length > 0 ? (
                            receipt.items.map((item, idx) => (
                                <tr key={item.id || idx} className="align-top">
                                    <td className="py-1.5 px-1 font-semibold text-black">
                                        {item.productId}
                                    </td>
                                    <td className="py-1.5 px-1 text-gray-800 font-mono">
                                        {item.batchId || "-"}
                                    </td>
                                    <td className="py-1.5 px-1 font-bold text-center text-black">
                                        {Number(item.quantity).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-1.5 px-1 text-gray-700 italic">
                                        {item.itemNotes || "-"}
                                    </td>
                                    <td className="py-1.5 px-1 text-center">
                                        <span className="inline-block h-3.5 w-3.5 border border-black rounded-sm" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-3 text-center text-gray-500 italic">
                                    No items listed in this receipt.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* DELIVERY / SPECIAL INSTRUCTIONS */}
            {receipt.notes && (
                <section className="mt-3 rounded border border-gray-400 p-2 text-[10px]">
                    <p className="font-bold uppercase text-gray-700">
                        Special Instructions / Notes:
                    </p>
                    <p className="text-black italic">{receipt.notes}</p>
                </section>
            )}

            {/* PROOF OF DELIVERY / SIGNATURE SECTION */}
            <section className="mt-6 pt-2">
                <p className="text-[9px] font-bold uppercase tracking-wider text-black">
                    PROOF OF DELIVERY & ACKNOWLEDGEMENT
                </p>
                <p className="text-[8px] text-gray-600 mt-0.5 leading-tight">
                    By signing below, the customer acknowledges receipt of all items listed
                    above in good condition and correct batch specification.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-6 text-[10px]">
                    <div>
                        <div className="border-b border-black pb-1"></div>
                        <p className="mt-1 font-bold text-black">Customer Signature</p>
                        <div className="mt-2 flex justify-between text-[9px] text-gray-700">
                            <span>Print Name: _________________</span>
                            <span>Date: ____/____/20__</span>
                        </div>
                    </div>

                    <div>
                        <div className="border-b border-black pb-1"></div>
                        <p className="mt-1 font-bold text-black">Dispatched / Driver Signature</p>
                        <div className="mt-2 flex justify-between text-[9px] text-gray-700">
                            <span>Driver: _________________</span>
                            <span>Time: ____:____</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER DISCLAIMER */}
            <footer className="mt-6 border-t border-gray-300 pt-2 text-center text-[8px] text-gray-600">
                <p>
                    Inspect all materials prior to installation. Any claims for shortages or
                    damaged goods must be noted upon delivery.
                </p>
            </footer>
        </div>
    );
}