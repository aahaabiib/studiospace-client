import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

import { WishlistProvider } from '@/context/WishlistContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'StudioSpace — Peer-to-Peer Creative Workspace Sharing',
  description:
    'Discover and book professional creative studios for photography, film, podcast, music and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
  <head>
    <script
      dangerouslySetInnerHTML={{
        __html: `try{if(localStorage.getItem('studiospace-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`,
      }}
    />
  </head>
  
      <body
        className={`${inter.variable} font-sans min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
            <Navbar />
            <main className="w-full min-w-0 flex-1">
              
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" richColors closeButton />
            
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider> 
      </body>
    </html>
  );
}