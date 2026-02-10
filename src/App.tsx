import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginModal from './components/LoginModal';
import CosmicBackground from './components/CosmicBackground';

function AppContent({ isLoggedIn, setIsLoggedIn, showLogin, setShowLogin }: any) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen text-white relative">
      {!isHome && <CosmicBackground />}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home onOpenLogin={() => setShowLogin(true)} isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile onLogout={() => setIsLoggedIn(false)} /> : <Navigate to="/" />} />
        </Routes>
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={() => { setIsLoggedIn(true); setShowLogin(false); }} />}
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <Router>
      <AppContent 
        isLoggedIn={isLoggedIn} 
        setIsLoggedIn={setIsLoggedIn} 
        showLogin={showLogin} 
        setShowLogin={setShowLogin} 
      />
    </Router>
  );
}

export default App;