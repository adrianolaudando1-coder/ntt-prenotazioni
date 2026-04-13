import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://ntt-prenotazioni-alpha.vercel.app'),
  title: 'NTT Salerno - Prenotazione Postazioni',
  description: 'Applicazione interna per prenotare le postazioni di lavoro presso NTT DATA Salerno',
  openGraph: {
    title: 'NTT Salerno - Prenotazione Postazioni',
    description: 'Prenota la tua postazione in ufficio',
    url: '/',
    siteName: 'NTT Salerno Booking',
    images: ['/anteprima.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NTT Salerno - Prenotazione Postazioni',
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
