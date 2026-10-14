import { DeliveryAddressProps } from '@/modules/future-delivery/domain/future-delivery.entity';

interface DeliveryAddressCardProps {
    address: DeliveryAddressProps;
}

export function DeliveryAddressCard({ address }: DeliveryAddressCardProps) {
    return (
        <div className="bg-surface border border-border rounded-xl p-4">
            <h2 className="text-xs font-semibold text-tertiary uppercase mb-3">
                Delivery Address
            </h2>
            <p className="text-sm text-primary leading-relaxed">
                {address.street}, {address.number}
                {address.complement ? ` (${address.complement})` : ''}
            </p>
            <p className="text-sm text-primary leading-relaxed">
                {address.neighborhood}, {address.city} / {address.state}
            </p>
            <p className="text-sm text-primary leading-relaxed">{address.zipCode}</p>
        </div>
    );
}