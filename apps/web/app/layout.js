import './globals.css';

export const metadata = {
  title: 'Nirvana Entretenimiento | Phoenix World Cup 2026',
  description: 'Phoenix-themed multilingual World Cup 2026 campaign portal'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
