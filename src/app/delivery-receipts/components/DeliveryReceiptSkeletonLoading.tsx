export function DeliveryReceiptSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <tr key={index} className="animate-pulse">
                    <td className="px-4 py-3.5">
                        <div className="h-4 w-28 rounded bg-subtle" />
                    </td>
                    <td className="px-4 py-3.5">
                        <div className="h-4 w-24 rounded bg-subtle" />
                    </td>
                    <td className="px-4 py-3.5">
                        <div className="h-4 w-36 rounded bg-subtle" />
                    </td>
                    <td className="px-4 py-3.5">
                        <div className="h-4 w-48 rounded bg-subtle" />
                    </td>
                    <td className="px-4 py-3.5">
                        <div className="h-5 w-20 rounded-full bg-subtle" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                        <div className="ml-auto h-7 w-20 rounded bg-subtle" />
                    </td>
                </tr>
            ))}
        </>
    );
}