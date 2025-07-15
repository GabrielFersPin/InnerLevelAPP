import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { showAlert } from '../../utils/notifications';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          showAlert('Passwords do not match', 'error');
          return;
        }

        if (formData.password.length < 6) {
          showAlert('Password must be at least 6 characters', 'error');
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.username);
        
        if (error) {
          showAlert(error.message, 'error');
        } else {
          showAlert('Account created successfully! Please check your email to verify your account.', 'success');
          onClose();
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          showAlert(error.message, 'error');
        } else {
          showAlert('Welcome back!', 'success');
          onClose();
        }
      }
    } catch (error) {
      showAlert('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    });
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-amber-500/30">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-8 h-8 text-slate-900" />
          </div>
          <h2 className="text-2xl font-bold text-amber-200">
            {isSignUp ? 'Begin Your Quest' : 'Welcome Back, Hero'}
          </h2>
          <p className="text-slate-300 mt-2">
            {isSignUp ? 'Join LifeQuest RPG and discover your character class' : 'Continue your legendary journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Hero Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-400"
                  placeholder="Choose your hero name"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-400"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-400"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-amber-500/30 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-200 placeholder-slate-400"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-3 px-6 rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all duration-300 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900 mr-2"></div>
                {isSignUp ? 'Forging Character...' : 'Entering Realm...'}
              </div>
            ) : (
              isSignUp ? 'Begin Quest' : 'Enter Realm'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-amber-400 hover:text-amber-300 font-medium"
          >
            {isSignUp ? 'Already a hero? Enter realm' : "New adventurer? Begin quest"}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-300 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-700/50 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}