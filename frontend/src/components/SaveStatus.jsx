
import { Check, Loader, WifiOff } from 'lucide-react';

const SaveStatus = ({ status = 'saved' }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'saving':
                return {
                    icon: <Loader size={14} className="animate-spin-slow" />,
                    text: 'Saving...',
                    colorClass: 'text-[var(--color-text-secondary)]'
                };
            case 'saved':
                return {
                    icon: <Check size={14} />,
                    text: 'Saved',
                    colorClass: 'text-[var(--color-success)]'
                };
            case 'offline':
                return {
                    icon: <WifiOff size={14} />,
                    text: 'Offline',
                    colorClass: 'text-[var(--color-warning)]'
                };
            case 'error':
                return {
                    icon: null,
                    text: 'Save failed',
                    colorClass: 'text-[var(--color-error)]'
                };
            default:
                return {
                    icon: null,
                    text: '',
                    colorClass: 'text-[var(--color-text-secondary)]'
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className={`flex items-center gap-1.5 text-sm font-medium ${config.colorClass}`}>
            {config.icon}
            <span>{config.text}</span>
        </div>
    );
};

export default SaveStatus;
