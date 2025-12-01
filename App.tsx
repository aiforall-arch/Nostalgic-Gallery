import React, { useState, useEffect } from 'react';
import { ViewState, User } from './types';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Gallery } from './components/Gallery';
import { FilmGrain } from './components/FilmGrain';
import AdminDashboard from './components/AdminDashboard';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [user, setUser] = useState<User>({ isAuthenticated: false });
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSuccess = (identifier: string) => {
    setUser({
      isAuthenticated: true,
      email: identifier.includes('@') ? identifier : undefined,
      phone: identifier.includes('@') ? undefined : identifier,
    });
    setView(ViewState.GALLERY);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user.isAuthenticated) {
        setIsAdmin(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setIsAdmin(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      setIsAdmin(profile?.is_admin === true);
    };

    checkAdmin();
  }, [user.isAuthenticated]);

  return (
    <>
      <FilmGrain />

      {view === ViewState.LANDING && (
        <LandingPage onGetStarted={() => setView(ViewState.LOGIN)} />
      )}

      {view === ViewState.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {view === ViewState.GALLERY && (
        <>
          <Gallery user={user} />

          {isAdmin && (
            <div
              style={{
                position: 'fixed',
                bottom: 16,
                right: 16,
              }}
            >
              <button onClick={() => setView(ViewState.ADMIN)}>
                Admin Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {view === ViewState.ADMIN && (
        <AdminDashboard onBack={() => setView(ViewState.GALLERY)} />
      )}
    </>
  );
};

export default App;
