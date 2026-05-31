import StickyHeader from '@/components/StickyHeader/StickyHeader';
import IntroOverlay from '@/components/IntroOverlay/IntroOverlay';
import { SmoothScroll } from '@/components/SmoothScroll/SmoothScroll';
import { ScrollBackground } from '@/components/ScrollBackground/ScrollBackground';
import Hero from '@/components/Hero/Hero';
import Features from '@/components/sections/Features/Features';
import How from '@/components/sections/How/How';
import Story from '@/components/sections/Story/Story';
import Pricing from '@/components/sections/Pricing/Pricing';
import FAQ from '@/components/sections/FAQ/FAQ';
import Comparison from '@/components/sections/Comparison/Comparison';
import Footer from '@/components/sections/Footer/Footer';
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
