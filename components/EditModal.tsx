'use client';

import { useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saving?: boolean;
}

export default function EditModal({ isOpen, onClose, title, children, onSave, saving }: EditModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex items-center gap-2">
            {onSave && (
              <button
                onClick={onSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 text-sm font-medium"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Check className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

