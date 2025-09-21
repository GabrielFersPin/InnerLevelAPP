#!/bin/bash
# Script de inicio rápido para InnerLevelAPP

echo "🚀 Iniciando InnerLevelAPP..."

# Terminal 1: Backend
echo "🔧 Iniciando servidor backend..."
cd server && npm install && npm start &

# Terminal 2: Frontend  
echo "🎨 Iniciando frontend..."
cd frontend && npm install && npm run dev &

echo "✅ Aplicación iniciada!"
echo "🌐 Frontend: http://localhost:5176"
echo "⚙️ Backend: http://localhost:5000"
echo ""
echo "📋 Para verificar:"
echo "curl http://localhost:5000/health"
