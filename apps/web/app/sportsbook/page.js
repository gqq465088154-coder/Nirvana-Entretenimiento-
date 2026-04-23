'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSportsbookEvents, placeBet } from '../../lib/api/client';
import { phoenixTheme } from '../../lib/theme/phoenixTheme';

export default function SportsbookPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [betResult, setBetResult] = useState(null);

  useEffect(() => {
    getSportsbookEvents()
      .then((data) => setEvents(data.events || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleBet(eventId, market) {
    try {
      setBetResult(null);
      const result = await placeBet(eventId, market, 10);
      setBetResult(`Bet ${result.betId} placed — ${result.status}`);
    } catch (err) {
      setBetResult(`Error: ${err.message}`);
    }
  }

  return (
    <main style={{ background: phoenixTheme.colors.night, color: phoenixTheme.colors.text, minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontFamily: phoenixTheme.typography.heading, color: phoenixTheme.colors.flame }}>
        🔥 Sportsbook
      </h1>
      <p><Link href="/" style={{ color: phoenixTheme.colors.glow }}>← Back to Home</Link></p>

      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: '#ff4444' }}>Error: {error}</p>}

      {betResult && (
        <div style={{ padding: '1rem', margin: '1rem 0', background: phoenixTheme.colors.ash, borderRadius: '8px', border: `1px solid ${phoenixTheme.colors.ember}` }}>
          {betResult}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
        {events.map((event) => (
          <article key={event.id} style={{ background: phoenixTheme.colors.ash, padding: '1.5rem', borderRadius: '12px', boxShadow: phoenixTheme.shadows.card }}>
            <h2 style={{ margin: 0, color: phoenixTheme.colors.glow }}>{event.home} vs {event.away}</h2>
            <p style={{ color: '#aaa' }}>{event.league}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={() => handleBet(event.id, 'home')} type="button"
                style={{ padding: '0.5rem 1rem', background: phoenixTheme.colors.ember, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Home {event.odds.home}
              </button>
              <button onClick={() => handleBet(event.id, 'draw')} type="button"
                style={{ padding: '0.5rem 1rem', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Draw {event.odds.draw}
              </button>
              <button onClick={() => handleBet(event.id, 'away')} type="button"
                style={{ padding: '0.5rem 1rem', background: phoenixTheme.colors.flame, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Away {event.odds.away}
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
