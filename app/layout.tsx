import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Type Horizon — Escape the Black Hole',
  description: 'A typing survival game. Type fast or get consumed.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#020408] text-slate-200 antialiased">{children}</body>
    </html>
  );
}
