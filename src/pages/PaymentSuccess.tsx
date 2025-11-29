import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Zap, Target, TrendingUp, ArrowRight, Check } from 'lucide-react';
import { getApiUrl } from '../config/environment';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: "Unlimited AI Card Generation" },
    { icon: <Target className="w-5 h-5" />, text: "Advanced Strategic Battle System" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Detailed Progress Analytics" },
    { icon: <Crown className="w-5 h-5" />, text: "Priority AI Support" }
  ];

  // Verificar el pago cuando se carga la página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    if (sessionId) {
      // Verificar el pago con el backend
      verifyPayment(sessionId);
    } else {
      // Si no hay session_id, asumir que el pago fue exitoso (para testing)
      setPaymentVerified(true);
    }
  }, []);

  // Animación de características
  useEffect(() => {
    if (paymentVerified) {
      setShowAnimation(true);
      const timer = setInterval(() => {
        setCurrentStep(prev => prev < features.length ? prev + 1 : prev);
      }, 800);

      return () => clearInterval(timer);
    }
  }, [paymentVerified]);

  // Función para verificar el pago con el backend
  const verifyPayment = async (sessionId: string) => {
    try {
      console.log('🔍 Verifying payment with session_id:', sessionId);

      const response = await fetch(`${getApiUrl()}/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Payment verified successfully:', data);
        setPaymentVerified(true);
      } else {
        const errorData = await response.json();
        console.error('❌ Error verifying payment:', errorData);
        setVerificationError(errorData.error || 'Error verifying payment');
      }
    } catch (error) {
      console.error('❌ Network error verifying payment:', error);
      setVerificationError('Connection error. Please check your internet connection.');
    }
  };

  const handleContinueToApp = () => {
    // Redirigir de vuelta a la app principal usando React Router
    navigate('/');
  };

  // Mostrar estado de carga mientras se verifica el pago
  if (!paymentVerified && !verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping">
              <Crown className="w-24 h-24 text-yellow-400 mx-auto opacity-75" />
            </div>
            <Crown className="w-24 h-24 text-yellow-400 mx-auto relative z-10" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Verifying Payment...</h1>
          <p className="text-gray-300 text-lg">Please wait while we confirm your payment</p>
          <div className="mt-8">
            <div className="w-8 h-8 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si la verificación falló
  if (verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Verification Error</h1>
            <p className="text-gray-300 text-lg mb-6">{verificationError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">

        {/* Animación de Level Up */}
        <div className={`transform transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>

          {/* Crown Icon con brillo */}
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping">
              <Crown className="w-24 h-24 text-yellow-400 mx-auto opacity-75" />
            </div>
            <Crown className="w-24 h-24 text-yellow-400 mx-auto relative z-10" />
            <div className="absolute -top-4 -right-4">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-4">
              <Sparkles className="w-6 h-6 text-blue-300 animate-pulse" />
            </div>
          </div>

          {/* Mensaje principal */}
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            ¡LEVEL UP!
          </h1>

          <h2 className="text-2xl font-semibold text-white mb-2">
            Welcome to InnerLevel Premium!
          </h2>

          <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
            Your payment has been processed successfully. You now have full access to all premium features to turn your goals into epic adventures.
          </p>
        </div>

        {/* Características desbloqueadas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Unlocked Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${index < currentStep
                    ? 'bg-green-500/20 border border-green-500/30 text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400'
                  }`}
              >
                <div className={`transition-all duration-300 ${index < currentStep ? 'text-green-400' : 'text-gray-500'
                  }`}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : feature.icon}
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats de usuario */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-yellow-400">∞</div>
            <div className="text-sm text-gray-300">AI Cards</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-400">Premium</div>
            <div className="text-sm text-gray-300">Level</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-sm text-gray-300">Support</div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 mb-8 border border-purple-500/30">
          <h4 className="text-lg font-semibold text-white mb-2">
            🎮 Your epic adventure begins now!
          </h4>
          <p className="text-gray-300">
            Every goal you set will be a new mission. Every small step, a victory.
            With AI as your ally, there is no limit to what you can achieve.
          </p>
        </div>

        {/* Botón para continuar */}
        <button
          onClick={handleContinueToApp}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
        >
          Start My Adventure
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Información adicional */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>Your subscription will renew automatically every month.</p>
          <p>You can cancel anytime from your profile.</p>
        </div>

        {/* Partículas de fondo animadas */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="w-3 h-3 text-yellow-400/30" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PaymentSuccess;
