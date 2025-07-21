import { useEffect } from "react";

export default function NotificationMessage({ message, type, onDismiss }) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);
    if (message) {
        console.log("message: ", message, ",  type : ", type);
    }
    return (
        <div
            className={`fixed bottom-4 left-4 p-2 rounded-md shadow-lg z-50 ${
                type === "success"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
            }`}
            onClick={(e) => {
                // Only dismiss if clicking on the background, not the button
                if (e.target === e.currentTarget) {
                    onDismiss();
                }
            }}
        >
            {message}
            <button onClick={onDismiss} className="ml-4">
                ×
            </button>
        </div>
    );
}
