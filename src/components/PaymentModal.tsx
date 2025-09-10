import React, { useState } from 'react';
import { X, CreditCard, Zap, Crown } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lookup_key: 'premium-monthly' // You can customize this
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Upgrade Required</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-300 mb-4">
            You've reached your monthly limit of AI-generated cards. Upgrade to Premium to continue generating unlimited cards!
          </p>
          
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="font-semibold text-white">Premium Features</h3>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Unlimited AI card generation</li>
              <li>• Advanced character customization</li>
              <li>• Priority support</li>
              <li>• Exclusive card templates</li>
            </ul>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">$9.99</div>
            <div className="text-sm text-slate-400">per month</div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-slate-300 border border-slate-600 rounded-xl hover:bg-slate-700 transition-colors"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Upgrade Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}