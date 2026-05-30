import StickyHeader from '@/components/StickyHeader';
import IntroOverlay from '@/components/IntroOverlay';
import { SmoothScroll } from '@/components/SmoothScroll';
import { ScrollBackground } from '@/components/ScrollBackground';
import Hero from '@/components/Hero';
import Features from '@/components/sections/Features';
import How from '@/components/sections/How';
import Story from '@/components/sections/Story';
import Pricing from '@/components/sections/Pricing';
import FAQ from '@/components/sections/FAQ';
import Comparison from '@/components/sections/Comparison';
import Footer from '@/components/sections/Footer';
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
