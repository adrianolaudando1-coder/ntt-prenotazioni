import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://prenotazioni-alpha.vercel.app'),
  title: 'Salerno - Prenotazione Postazioni',
  description: 'Applicazione interna per prenotare le postazioni di lavoro',
  openGraph: {
    title: 'Salerno - Prenotazione Postazioni',
    description: 'Prenota la tua postazione in ufficio',
    url: '/',
    siteName: 'Salerno Booking',
    images: ['/anteprima.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salerno - Prenotazione Postazioni',
    description: 'Prenota la tua postazione in ufficio',
    images: ['/anteprima.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
