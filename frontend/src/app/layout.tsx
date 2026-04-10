import type { Metadata } from 'next';
import { Inter, Outfit } from "next/font/google";
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import AuthSync from '@/components/firebase/auth-sync';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: 'Yearly Tracker 2026',
  description: 'Your personal AI assistant for a productive and balanced life.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthSync />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
