import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainApp } from './pages/MainApp';
import PaymentSuccess from './pages/PaymentSuccess';


// import { useUserData } from './hooks/useUserData';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;