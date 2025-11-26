import React, { useState } from 'react';
import { ViewState, User } from './types';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Gallery } from './components/Gallery';
import { FilmGrain } from './components/FilmGrain';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User>({ isAuthenticated: false });

  const handleLoginSuccess = (identifier: string) => {
    setUser({
      isAuthenticated: true,
      email: identifier.includes('@') ? identifier : undefined,
      phone: identifier.includes('@') ? undefined : identifier,
    });
    setView(ViewState.GALLERY);
  };

  const handleLogout = () => {
    setUser({ isAuthenticated: false });
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

      {view === ViewState.GALLERY && user.isAuthenticated && (
        <Gallery 
          onLogout={handleLogout} 
          userName={user.email || user.phone || 'Guest'}
        />
      )}
    </>
  );
};

export default App;
