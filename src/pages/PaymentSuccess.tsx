import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Sparkles, Zap, Target, TrendingUp, ArrowRight, Check } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    { icon: <Zap className="w-5 h-5" />, text: "Generación ilimitada de cartas IA" },
    { icon: <Target className="w-5 h-5" />, text: "Sistema de batalla estratégica avanzado" },
    { icon: <TrendingUp className="w-5 h-5" />, text: "Analytics detallados de progreso" },
    { icon: <Crown className="w-5 h-5" />, text: "Soporte prioritario de IA" }
  ];

  useEffect(() => {
    setShowAnimation(true);
    const timer = setInterval(() => {
      setCurrentStep(prev => prev < features.length ? prev + 1 : prev);
    }, 800);

    return () => clearInterval(timer);
  }, []);

  const handleContinueToApp = () => {
    // Redirigir de vuelta a la app principal usando React Router
    navigate('/');
  };

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
            ¡Bienvenido a InnerLevel Premium!
          </h2>
          
          <p className="text-gray-300 text-lg mb-8 max-w-lg mx-auto">
            Tu pago ha sido procesado exitosamente. Ahora tienes acceso completo a todas las funcionalidades premium para convertir tus metas en épicas aventuras.
          </p>
        </div>

        {/* Características desbloqueadas */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Características Desbloqueadas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-500 ${
                  index < currentStep 
                    ? 'bg-green-500/20 border border-green-500/30 text-white' 
                    : 'bg-white/5 border border-white/10 text-gray-400'
                }`}
              >
                <div className={`transition-all duration-300 ${
                  index < currentStep ? 'text-green-400' : 'text-gray-500'
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
            <div className="text-sm text-gray-300">Cartas IA</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-blue-400">Premium</div>
            <div className="text-sm text-gray-300">Nivel</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-sm text-gray-300">Soporte</div>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 mb-8 border border-purple-500/30">
          <h4 className="text-lg font-semibold text-white mb-2">
            🎮 ¡Tu aventura épica comienza ahora!
          </h4>
          <p className="text-gray-300">
            Cada meta que establezcas será una nueva misión. Cada pequeño paso, una victoria. 
            Con la IA como tu aliada, no hay límite para lo que puedes lograr.
          </p>
        </div>

        {/* Botón para continuar */}
        <button
          onClick={handleContinueToApp}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group"
        >
          Comenzar Mi Aventura
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Información adicional */}
        <div className="mt-8 text-gray-400 text-sm">
          <p>Tu suscripción se renovará automáticamente cada mes.</p>
          <p>Puedes cancelar en cualquier momento desde tu perfil.</p>
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
