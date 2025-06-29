import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: "Fireplexity - AI-Powered Search",
  description: "Advanced search with AI-powered insights and real-time stock information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <div className="h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
