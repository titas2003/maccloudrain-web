import React from 'react';
import { ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';

export default function ClientVerifier() {
  return (
    <div className="bg-[#1a2b4b] p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
      {/* Decorative Background Element */}
      <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32" />

      <div className="relative z-10">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
          <ShieldCheck size={20} className="text-blue-400" />
          Client KYC Verifier
        </h3>
        <p className="text-blue-200 text-xs mb-6 leading-relaxed">
          Verify client identity instantly via Bar Association secure link before sharing sensitive documents.
        </p>

        <div className="flex gap-3">
          <button className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2">
            <UserPlus size={16} /> New Verification
          </button>
          <button className="px-4 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold text-xs transition-all">
            History
          </button>
        </div>
      </div>
    </div>
  );
}