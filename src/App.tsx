import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import HairProfile from './pages/HairProfile';
import Skincare from './pages/Skincare';
import HairCare from './pages/HairCare';
import Grooming from './pages/Grooming';
import Fashion from './pages/Fashion';
import Onboarding from './pages/Onboarding';
import SkinOnboarding from './pages/SkinOnboarding';
import HairOnboarding from './pages/HairOnboarding';
import FashionOnboarding from './pages/FashionOnboarding';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    // Check for token in localStorage whenever component mounts or rerenders
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for storage changes (e.g., when token is set in another tab or same tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case of same-tab updates
    const checkTokenInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!!token !== isLoggedIn) {
        setIsLoggedIn(!!token);
      }
    }, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkTokenInterval);
    };
  }, [isLoggedIn]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
      <Route path="/profile/hair" element={isLoggedIn ? <HairProfile /> : <Navigate to="/login" replace />} />
      <Route path="/skincare" element={isLoggedIn ? <Skincare /> : <Navigate to="/login" replace />} />
      <Route path="/haircare" element={isLoggedIn ? <HairCare /> : <Navigate to="/login" replace />} />
      <Route path="/grooming" element={isLoggedIn ? <Grooming /> : <Navigate to="/login" replace />} />
      <Route path="/fashion" element={isLoggedIn ? <Fashion /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding" element={isLoggedIn ? <Onboarding /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding/skin" element={isLoggedIn ? <SkinOnboarding /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding/hair" element={isLoggedIn ? <HairOnboarding /> : <Navigate to="/login" replace />} />
      <Route path="/onboarding/fashion" element={isLoggedIn ? <FashionOnboarding /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
