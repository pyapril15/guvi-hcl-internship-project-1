import React from 'react';

interface ErrorBannerProps {
    error: string;
    isOnline: boolean;
    onRetry: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({error, isOnline, onRetry}) => {
    const getErrorStyles = () => {
        if (isOnline) {
            return {
                container: 'bg-red-50 border border-red-200',
                icon: 'bg-red-500',
                text: 'text-red-700',
                button: 'bg-red-100 text-red-700 hover:bg-red-200'
            };
        } else {
            return {
                container: 'bg-yellow-50 border border-yellow-200',
                icon: 'bg-yellow-500',
                text: 'text-yellow-700',
                button: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
            };
        }
    };

    const styles = getErrorStyles();

    return (
        <div className={`p-3 rounded-lg mb-4 ${styles.container}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${styles.icon}`}></div>
                    <span className={`text-sm ${styles.text}`}>
                        {error}
                    </span>
                </div>
                <button
                    onClick={onRetry}
                    className={`text-xs px-3 py-1 rounded transition-colors ${styles.button}`}
                >
                    Retry
                </button>
            </div>

            {!isOnline && (
                <div className="mt-2 pl-4">
                    <p className="text-xs text-yellow-600">
                        • Check your internet connection<br/>
                        • Verify the backend server is running<br/>
                        • Ensure the API URL is correct
                    </p>
                </div>
            )}
        </div>
    );
};

export default ErrorBanner;