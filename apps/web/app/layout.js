import './globals.css';

export const metadata = {
  title: 'Nirvana Entretenimiento | Phoenix 2026',
  description: 'Phoenix style World Cup 2026 campaign homepage'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
