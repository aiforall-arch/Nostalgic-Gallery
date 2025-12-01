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

  const handleLoginSuccess = (identifier: string) => {
    const email = identifier.includes('@') ? identifier : undefined;
    const phone = identifier.includes('@') ? undefined : identifier;

    setUser({
      isAuthenticated: true,
      email,
      phone,
    });

    // ✅ Simple admin check: if you logged in with your admin email
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
        <LandingPage onGetStarted={() => setView(ViewState.LOGIN)} />
      )}

      {view === ViewState.LOGIN && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

      {view === ViewState.GALLERY && (
        <>
          <Gallery user={user} onLogout={handleLogout} />

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
Note: if your Gallery component doesn’t accept onLogout, just remove onLogout={handleLogout} and keep Gallery user={user} exactly as it was.

Scroll down → Commit changes…

2️⃣ Make sure AdminDashboard.tsx exists
You already showed import AdminDashboard from './components/AdminDashboard'; ✅

Just confirm you have components/AdminDashboard.tsx with at least this content:

tsx
Copy code
import React from 'react';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem' }}>
        ← Back to gallery
      </button>
      <h2>Admin Dashboard</h2>
      <p>
        This is your admin area. We can later add controls here for deleting
        media, viewing logs, etc.
      </p>
    </div>
  );
};

export default AdminDashboard;
