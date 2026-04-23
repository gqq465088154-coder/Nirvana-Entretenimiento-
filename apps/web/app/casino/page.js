'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCasinoGames, createCasinoSession } from '../../lib/api/client';
import { phoenixTheme } from '../../lib/theme/phoenixTheme';

export default function CasinoPage() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionResult, setSessionResult] = useState(null);

  useEffect(() => {
    getCasinoGames()
      .then((data) => setGames(data.games || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handlePlay(gameId) {
    try {
      setSessionResult(null);
      const result = await createCasinoSession(gameId);
      setSessionResult(`Session ${result.sessionId} — ${result.status}`);
    } catch (err) {
      setSessionResult(`Error: ${err.message}`);
    }
  }

  const categoryColors = {
    slots: phoenixTheme.colors.ember,
    roulette: phoenixTheme.colors.flame,
    table: phoenixTheme.colors.glow
  };

  return (
    <main style={{ background: phoenixTheme.colors.night, color: phoenixTheme.colors.text, minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontFamily: phoenixTheme.typography.heading, color: phoenixTheme.colors.flame }}>
        🎰 Casino
      </h1>
      <p><Link href="/" style={{ color: phoenixTheme.colors.glow }}>← Back to Home</Link></p>

      {loading && <p>Loading games...</p>}
      {error && <p style={{ color: '#ff4444' }}>Error: {error}</p>}

      {sessionResult && (
        <div style={{ padding: '1rem', margin: '1rem 0', background: phoenixTheme.colors.ash, borderRadius: '8px', border: `1px solid ${phoenixTheme.colors.ember}` }}>
          {sessionResult}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '1000px' }}>
        {games.map((game) => (
          <article key={game.id} style={{ background: phoenixTheme.colors.ash, padding: '1.5rem', borderRadius: '12px', boxShadow: phoenixTheme.shadows.card }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: categoryColors[game.category] || '#999', fontWeight: 700 }}>
              {game.category}
            </span>
            <h2 style={{ margin: '0.5rem 0', color: phoenixTheme.colors.glow }}>{game.name}</h2>
            <p style={{ color: '#aaa' }}>RTP: {game.rtp}%</p>
            <button onClick={() => handlePlay(game.id)} type="button"
              style={{ marginTop: '0.75rem', padding: '0.5rem 1.5rem', background: phoenixTheme.colors.ember, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              Play Now
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
