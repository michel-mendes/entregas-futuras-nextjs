interface SwitchProps {
    checked: boolean;
    onChange: (value: boolean) => void;
    label: string;
    description?: string;
}

export function Switch({ checked, onChange, label, description }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className="flex items-center justify-between w-full gap-4 group focus:outline-none"
        >
            <div className="text-left">
                <span className="text-sm font-medium text-primary block">{label}</span>
                {description && (
                    <span className="text-xs text-tertiary mt-0.5 block">{description}</span>
                )}
            </div>
            <div
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-brand/20 ${checked
                    ? 'bg-brand border-brand'
                    : 'bg-subtle border-border'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                />
            </div>
        </button>
    );
}