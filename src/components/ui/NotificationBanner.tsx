import { IconCheckCircle, IconXCircle } from "./Icons";

export interface INotification {
    type: 'success' | 'error';
    message: string;
}

export function NotificationBanner({ notification, onDismiss }: { notification: INotification; onDismiss: () => void }) {
    const isSuccess = notification.type === 'success';
    return (
        <div
            className={`flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm font-medium ${isSuccess
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
        >
            {isSuccess ? <IconCheckCircle /> : <IconXCircle />}
            <span className="flex-1">{notification.message}</span>
            <button
                type="button"
                onClick={onDismiss}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity ml-auto"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}