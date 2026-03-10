import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Skincare from './pages/Skincare';
import HairCare from './pages/HairCare';
import Grooming from './pages/Grooming';
import Fashion from './pages/Fashion';
import Onboarding from './pages/Onboarding';
import SkinOnboarding from './pages/SkinOnboarding';
import HairOnboarding from './pages/HairOnboarding';

function App() {
  // Read token directly per render so auth guards reflect same-tab login/logout immediately.
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/skincare" element={isLoggedIn ? <Skincare /> : <Navigate to="/login" replace />} />
      <Route path="/haircare" element={isLoggedIn ? <HairCare /> : <Navigate to="/login" replace />} />
      <Route path="/grooming" element={isLoggedIn ? <Grooming /> : <Navigate to="/login" replace />} />
      <Route path="/fashion" element={isLoggedIn ? <Fashion /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding" element={isLoggedIn ? <Onboarding /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding/skin" element={isLoggedIn ? <SkinOnboarding /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding/hair" element={isLoggedIn ? <HairOnboarding /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
