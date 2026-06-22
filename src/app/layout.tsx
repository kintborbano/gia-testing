import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Pixelify_Sans } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import PageTransitionProvider from '@/components/transition/PageTransitionProvider';
import ImageGuard from '@/components/ImageGuard';
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

const averiaSerifLibre = localFont({
  src: [
    {
      path: '../../public/fonts/AveriaSerifLibre-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/AveriaSerifLibre-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-averia-serif',
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

const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-pixelify-sans',
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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${averiaSerifLibre.variable} ${youngSerif.variable} ${itcGaramond.variable} ${itcGaramondNarrowItalic.variable} ${pixelifySans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ImageGuard />
        <PageTransitionProvider>{children}</PageTransitionProvider>
      </body>
      {/* GA4 — loads only when NEXT_PUBLIC_GA_ID is set at build time. Handles
          App Router client-side navigations as page_views automatically.
          googletagmanager.com / google-analytics.com are already allowed by the
          hosting CSP in firebase.json. */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
