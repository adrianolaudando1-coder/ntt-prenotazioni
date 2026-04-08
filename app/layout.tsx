import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NTT Salerno prenotazione postazioni',
  description: 'Applicazione per la prenotazione delle postazioni',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div style={styles.wrapper}>
          <header style={styles.header}>
            <img src="/logo.png" alt="Logo" style={styles.logo} />
          </header>

          <div style={styles.content}>
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
