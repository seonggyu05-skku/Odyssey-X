import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';
import CosmicBackground from './components/CosmicBackground';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function AppContent({ isLoggedIn, showLogin, setShowLogin }: any) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen text-white relative">
      {!isHome && <CosmicBackground />}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home onOpenLogin={() => setShowLogin(true)} isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />} />
        </Routes>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center font-mono text-white tracking-widest uppercase">Initializing Odyssey...</div>;
  }

  return (
    <Router>
      <AppContent 
        isLoggedIn={isLoggedIn} 
        showLogin={showLogin} 
        setShowLogin={setShowLogin} 
      />
    </Router>
  );
}

export default App;