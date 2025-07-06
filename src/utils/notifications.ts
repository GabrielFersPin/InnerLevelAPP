export function showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') {
  // Create alert element
  const alertDiv = document.createElement('div');
  const bgColor = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  }[type];

  alertDiv.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 min-w-80 transform transition-all duration-300 ease-out`;
  alertDiv.textContent = message;
  alertDiv.style.transform = 'translateX(100%)';
  
  document.body.appendChild(alertDiv);

  // Animate in
  setTimeout(() => {
    alertDiv.style.transform = 'translateX(0)';
  }, 10);

  // Remove after 3 seconds
  setTimeout(() => {
    alertDiv.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 300);
  }, 3000);
}

export function showConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    size: number;
  }> = [];
  
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];

  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: Math.random() * 6 - 3,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 5 + 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confetti.forEach((piece, index) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      
      if (piece.y > canvas.height) {
        confetti.splice(index, 1);
      }
      
      ctx.fillStyle = piece.color;
      ctx.beginPath();
      ctx.arc(piece.x, piece.y, piece.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    if (confetti.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  
  animate();
}