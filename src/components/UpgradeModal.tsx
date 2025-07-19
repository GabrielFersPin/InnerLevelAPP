import React from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[70] p-4">
      <div className="bg-gradient-to-br from-amber-100 via-white to-amber-200 rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-amber-400 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400 hover:text-amber-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-100 transition-colors"
        >
          ✕
        </button>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-3xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-amber-700 mb-2">Upgrade to Premium</h2>
          <p className="text-amber-800 mb-2">Unlock personalized AI card generation, advanced features, and more!</p>
        </div>
        <ul className="text-left text-amber-900 mb-6 space-y-2">
          <li>• AI-powered, goal-specific card creation</li>
          <li>• More daily recommendations</li>
          <li>• Priority support & feature requests</li>
          <li>• Support ongoing development</li>
        </ul>
        <button
          onClick={onUpgrade}
          className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-amber-600 transition-all duration-300"
        >
          Proceed to Upgrade
        </button>
      </div>
    </div>
  );
} 