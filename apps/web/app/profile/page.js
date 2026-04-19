'use client';

import { useState, useEffect } from 'react';
import { isLoggedIn, logout } from '../../lib/api/client';
import { phoenixTheme } from '../../lib/theme/phoenixTheme';

export default function ProfilePage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function handleLogout() {
    logout();
    setLoggedIn(false);
  }

  return (
    <main style={{ background: phoenixTheme.colors.night, color: phoenixTheme.colors.text, minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontFamily: phoenixTheme.typography.heading, color: phoenixTheme.colors.flame }}>
        👤 User Profile
      </h1>
      <p><a href="/" style={{ color: phoenixTheme.colors.glow }}>← Back to Home</a></p>

      <div style={{ background: phoenixTheme.colors.ash, padding: '2rem', borderRadius: '12px', maxWidth: '500px', boxShadow: phoenixTheme.shadows.card }}>
        {loggedIn ? (
          <>
            <p style={{ color: phoenixTheme.colors.glow }}>✅ You are logged in</p>
            <p style={{ color: '#aaa' }}>Token stored in local storage. Use the API to manage your bets and casino sessions.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="/sportsbook" style={{ padding: '0.5rem 1rem', background: phoenixTheme.colors.ember, color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>
                Sportsbook
              </a>
              <a href="/casino" style={{ padding: '0.5rem 1rem', background: phoenixTheme.colors.flame, color: '#fff', borderRadius: '6px', textDecoration: 'none' }}>
                Casino
              </a>
            </div>
            <button onClick={handleLogout} type="button"
              style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <p>You are not logged in.</p>
            <p style={{ color: '#aaa', marginTop: '0.5rem' }}>
              Use the backend API endpoints to register or login:
            </p>
            <ul style={{ color: '#aaa', paddingLeft: '1.5rem', lineHeight: '2' }}>
              <li><code>POST /api/auth/register</code> — create an account</li>
              <li><code>POST /api/auth/login</code> — authenticate</li>
              <li><code>POST /api/auth/token</code> — get a demo token</li>
            </ul>
          </>
        )}
      </div>
    </main>
  );
}
