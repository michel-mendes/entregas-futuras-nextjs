import { IconInfo } from "./Icons";

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormField({ label, required, error, hint, children, className = '' }: FormFieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm font-medium text-primary">
                {label}
                {required && <span className="text-brand ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && (
                <span className="flex items-center gap-1 text-xs text-tertiary">
                    <IconInfo />
                    {hint}
                </span>
            )}
            {error && (
                <span className="text-xs text-red-600 font-medium">{error}</span>
            )}
        </div>
    );
}