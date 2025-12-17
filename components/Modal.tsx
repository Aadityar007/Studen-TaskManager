import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg transform rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 animate-in fade-in zoom-in-95 sm:my-8">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold leading-6 text-gray-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;