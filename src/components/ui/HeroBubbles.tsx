import type { CSSProperties, ReactElement } from 'react';
import SpeechBubble from '@/components/SpeechBubble';

interface HeroBubblesProps {
  opacity: number;
}

type BubbleSide = 'left' | 'right';

interface BubbleConfig {
  id: string;
  side: BubbleSide;
  text: string;
  floatDelay: number;
  style: CSSProperties;
}

interface HeroBubbleProps {
  bubble: BubbleConfig;
  opacity: number;
  onBubbleClick: (text: string) => void;
}

const BUBBLES: BubbleConfig[] = [
  {
    id: 'left-hello',
    side: 'left',
    text: 'Hello there!',
    floatDelay: 0,
    style: { left: '50px', top: '20%' },
  },
  {
    id: 'left-eyes',
    side: 'left',
    text: '👀',
    floatDelay: 0.5,
    style: { left: 'calc(50px + 280px + 20px)', top: '20%' },
  },
  {
    id: 'left-welcome',
    side: 'left',
    text: 'Welcome aboard!',
    floatDelay: 1,
    style: { left: '-80px', top: '30%' },
  },
  {
    id: 'left-come-in',
    side: 'left',
    text: 'Come on in!',
    floatDelay: 1.5,
    style: { left: 'calc(50px + 280px + 20px)', top: 'calc(30% + 80px)' },
  },
  {
    id: 'right-scroll',
    side: 'right',
    text: 'Scroll down to see!',
    floatDelay: 0.2,
    style: { right: '50%', top: '20%' },
  },
  {
    id: 'right-sparkle',
    side: 'right',
    text: '✨',
    floatDelay: 0.7,
    style: { right: 'calc(50px + 280px + 20px)', top: '30%' },
  },
  {
    id: 'right-discover',
    side: 'right',
    text: 'Discover more!',
    floatDelay: 1.2,
    style: { right: '-80px', top: '30%' },
  },
  {
    id: 'right-started',
    side: 'right',
    text: "Let's get started!",
    floatDelay: 1.8,
    style: { right: 'calc(50px + 280px + 20px)', top: 'calc(30% + 80px)' },
  },
];

function HeroBubble({
  bubble,
  opacity,
  onBubbleClick,
}: HeroBubbleProps): ReactElement {
  return (
    <div
      data-bubble-side={bubble.side}
      style={{
        position: 'absolute',
        zIndex: 15,
        ...bubble.style,
      }}
    >
      <SpeechBubble
        text={bubble.text}
        position="top"
        floatDelay={bubble.floatDelay}
        opacity={opacity}
        onClick={() => onBubbleClick(bubble.text)}
      />
    </div>
  );
}

export default function HeroBubbles({
  opacity,
}: HeroBubblesProps): ReactElement {
  const handleBubbleClick = (text: string) => {
    console.log(`Clicked: ${text}`);
  };

  return (
    <>
      {BUBBLES.map((bubble) => (
        <HeroBubble
          key={bubble.id}
          bubble={bubble}
          opacity={opacity}
          onBubbleClick={handleBubbleClick}
        />
      ))}
    </>
  );
}
