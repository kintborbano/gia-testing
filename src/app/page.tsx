import StickyHeader from '@/components/StickyHeader';
import IntroOverlay from '@/components/IntroOverlay';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ScrollBackground } from '@/components/ScrollBackground';
import Hero from '@/components/Hero';
import Features from '@/components/landing/Features/Features';
import How from '@/components/landing/How';
import Story from '@/components/landing/Story';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import Comparison from '@/components/landing/Comparison';
import Footer from '@/components/landing/Footer';
import { HEADER_HEIGHT_LARGE } from '@/animations/headerAnimations';

export default function Home(): React.ReactElement {
  return (
    <IntroOverlay>
      <SmoothScroll>
        <ScrollBackground />
        <main
          className="w-full"
          style={{ paddingTop: `${HEADER_HEIGHT_LARGE}px` }}
        >
          <StickyHeader />
          <Hero />
          <Features />
          <How />
          <Story />
          <Pricing />
          <FAQ />
          <Comparison />
          <Footer />
        </main>
      </SmoothScroll>
    </IntroOverlay>
  );
}
