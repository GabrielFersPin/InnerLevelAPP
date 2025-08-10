import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface PaymentSuccessProps {
  onContinue: () => void;
}

export function PaymentSuccess({ onContinue }: PaymentSuccessProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-800/90 border border-emerald-500/30 rounded-2xl p-8 text-center shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-emerald-300 mb-2">Payment Successful</h1>
        <p className="text-slate-300 mb-6">
          Thank you for your support! Your account has been upgraded. You can now generate more cards with the Mystic Forge.
        </p>
        <button
          onClick={onContinue}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          Continue to Mystic Forge
        </button>
      </div>
    </div>
  );
}
