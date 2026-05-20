export function ProgressBar({ percentual, label }: { percentual: number, label?: string }) {
    const cor = percentual === 100 ? 'bg-green-500' : percentual > 0 ? 'bg-brand' : 'bg-border';
    return (
        <div className="w-full flex flex-col gap-1">
            <div className="w-full bg-subtle rounded-full h-1.5 overflow-hidden">
                <div className={`h-1.5 rounded-full ${cor} transition-all duration-500`} style={{ width: `${percentual}%` }} />
            </div>
            {label && <span className="text-[10px] text-tertiary font-medium">{label}</span>}
        </div>
    );
}