import type { Metadata } from 'next';
import localFont from 'next/font/local';
import PageTransitionProvider from '@/components/transition/PageTransitionProvider';
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
      path: '../../public/fonts/InstrumentSans-Medium.woff2',
      weight: '500',
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

const itcGaramond = localFont({
  src: [
    {
      path: '../../public/fonts/ITC Garamond Std Book Condensed.otf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-itc-garamond',
});

const itcGaramondNarrowItalic = localFont({
  src: [
    {
      path: '../../public/fonts/ITC Garamond Std Book Narrow Italic.otf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-itc-garamond-narrow-italic',
});

export const metadata: Metadata = {
  title: {
    default: 'GIA by SOFI AI',
    template: '%s · GIA by SOFI AI',
  },
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
      className={`${instrumentSans.variable} ${youngSerif.variable} ${itcGaramond.variable} ${itcGaramondNarrowItalic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
    </html>
  );
}
