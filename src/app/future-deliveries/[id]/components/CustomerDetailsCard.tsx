import { CustomerProps } from '@/modules/future-delivery/domain/future-delivery.entity';

interface CustomerDetailsCardProps {
    customer: CustomerProps;
}

export function CustomerDetailsCard({ customer }: CustomerDetailsCardProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="text-xs font-semibold text-tertiary uppercase mb-3">
                Customer Information
            </h2>
            <div className="space-y-1">
                <p className="text-sm font-medium text-primary">{customer.name}</p>
                <p className="text-xs text-secondary">
                    Document: <span className="font-mono text-tertiary">{customer.document}</span>
                </p>
                <p className="text-xs text-secondary">
                    Phone: <span className="font-mono text-tertiary">{customer.phone}</span>
                </p>
            </div>
        </div>
    );
}