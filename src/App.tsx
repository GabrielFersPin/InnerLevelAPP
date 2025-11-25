import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { MainApp } from './pages/MainApp';
import PaymentSuccess from './pages/PaymentSuccess';


// import { useUserData } from './hooks/useUserData';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
      </Router>
      <SpeedInsights />
    </>
  );
}

export default App;