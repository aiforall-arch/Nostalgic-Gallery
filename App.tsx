import React, { useState } from 'react';
import { ViewState, User } from './types';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Gallery } from './components/Gallery';
import { FilmGrain } from './components/FilmGrain';
import AdminDashboard from './components/AdminDashboard';

const ADMIN_EMAIL = 'jafferbasha240@gmail.com';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User>({ isAuthenticated: false });
  const [isAdmin, setIsAdmin] = useState(false);
  const [galleryRefresh, setGalleryRefresh] = useState(0);

  const handleLoginSuccess = (identifier: string) => {
    const email = identifier.includes('@') ? identifier : undefined;
    const phone = identifier.includes('@') ? undefined : identifier;

    setUser({
      isAuthenticated: true,
      email,
      phone,
    });

    if (email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    setView(ViewState.GALLERY);
  };

  const handleLogout = () => {
    setUser({ isAuthenticated: false });
    setIsAdmin(false);
    setView(ViewState.LANDING);
  };

  return (
    <>
      <FilmGrain />

      {view === ViewState.LANDING && (
        <LandingPage onEnter={() => setView(ViewState.LOGIN)} />
      )}

      {view === ViewState.LOGIN && (
        <LoginPage 
          onSuccess={handleLoginSuccess}
          onBack={() => setView(ViewState.LANDING)}
        />
      )}

      {view === ViewState.GALLERY && (
        <>
          <Gallery 
            key={galleryRefresh}
            userName={user.email || user.phone || 'Guest'} 
            onLogout={handleLogout} 
          />

          {isAdmin && (
            <div
              style={{
                position: 'fixed',
                bottom: 16,
                right: 16,
                zIndex: 30,
              }}
            >
              <button 
                onClick={() => setView(ViewState.ADMIN)}
                className="rounded bg-sienna px-4 py-2 text-sm text-white shadow-lg transition-all hover:bg-sienna/90"
              >
                Admin Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {view === ViewState.ADMIN && (
        <AdminDashboard onBack={() => {
          setView(ViewState.GALLERY);
          setGalleryRefresh(prev => prev + 1);
        }} />
      )}
    </>
  );
};

export default App;
