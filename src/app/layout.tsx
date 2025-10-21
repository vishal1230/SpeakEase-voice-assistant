import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './components/AuthProvider'; // <-- IMPORT THE PROVIDER

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpeakEase',
  description: 'Offline speech-to-text with AI responses',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {/* WRAP YOUR APP IN THE PROVIDER */}
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}