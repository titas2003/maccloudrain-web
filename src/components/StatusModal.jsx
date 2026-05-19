import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

export default function StatusModal({ isOpen, type, title, message, onConfirm, onClose, defaultValue = '' }) {
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) setInputValue(defaultValue);
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                
                {/* Dynamic Icon */}
                {type === 'loading' && (
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <Loader2 size={32} className="animate-spin" />
                    </div>
                )}
                {type === 'success' && (
                    <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} />
                    </div>
                )}
                {type === 'error' && (
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <XCircle size={32} />
                    </div>
                )}
                {(type === 'confirm' || type === 'confirm-reject') && (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${type === 'confirm-reject' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                        {type === 'confirm-reject' ? <XCircle size={32} /> : <CheckCircle size={32} />}
                    </div>
                )}
                {type === 'prompt' && (
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <HelpCircle size={32} />
                    </div>
                )}

                <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 mb-6">{message}</p>

                {type === 'prompt' && (
                    <div className="w-full mb-6 text-left">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Enter value..."
                            autoFocus
                        />
                    </div>
                )}

                {/* Loading Progress Bar */}
                {type === 'loading' && (
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2 overflow-hidden">
                        <div className="bg-blue-500 h-1.5 rounded-full w-full animate-pulse"></div>
                    </div>
                )}

                {/* Action Buttons */}
                {(type === 'confirm' || type === 'confirm-reject' || type === 'prompt') && (
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => type === 'prompt' ? onConfirm(inputValue) : onConfirm()}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors ${type === 'confirm-reject' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Confirm
                        </button>
                    </div>
                )}

                {(type === 'success' || type === 'error' || type === 'info') && (
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
}
