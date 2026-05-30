import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/styles/globals.css';
import '@/animations/keyframes.css';

const instrumentSans = localFont({
  src: [
    {
      path: '../../public/fonts/InstrumentSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/InstrumentSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-instrument-sans',
});

const youngSerif = localFont({
  src: [
    {
      path: '../../public/fonts/YoungSerif-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-young-serif',
});

export const metadata: Metadata = {
  title: 'GIA by SOFI AI',
  description: 'A tool that analyzes your TikTok hooks',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${youngSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
