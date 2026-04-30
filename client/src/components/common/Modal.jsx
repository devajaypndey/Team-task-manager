import { useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on escape key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Content */}
      <div
        className="relative w-full max-w-lg glass rounded-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-700/50">
          <h3 className="text-lg font-semibold text-surface-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700/50 transition-colors cursor-pointer"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
