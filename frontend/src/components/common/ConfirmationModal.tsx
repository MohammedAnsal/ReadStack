import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  confirmButtonColor?: "red" | "orange" | "green" | "blue";
  icon?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  confirmButtonColor = "blue",
  icon,
  isLoading = false,
  loadingText,
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700",
    orange: "bg-orange-600 hover:bg-orange-700",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-modal-overlay"
        onClick={onClose}
      >
        <div
          className="bg-black/50 backdrop-blur-sm absolute inset-0"
          onClick={onClose}
        ></div>
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10 animate-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {icon && <div className="flex justify-center mb-4">{icon}</div>}
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-center mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${colorClasses[confirmButtonColor]}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {loadingText || "Processing..."}
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-overlay {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes modal-content {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modal-overlay {
          animation: modal-overlay 0.2s ease-out;
        }

        .animate-modal-content {
          animation: modal-content 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
};
