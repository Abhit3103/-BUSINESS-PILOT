import * as React from "react"
import { X } from "lucide-react"

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
