import type { ReactElement } from 'react';
import Button from '@/components/ui/Button';

/**
 * Full-screen 404 surface shared by every "not found" route (the global
 * `app/not-found` and per-segment ones like `report/[handle]/not-found`) so
 * they all render the same design. Black canvas, oversized serif headline, and
 * a single "take me back" action home.
 */
export default function NotFound(): ReactElement {
  return (
    <main className="flex min-h-screen w-full flex-1 items-center bg-black text-white">
      <div className="w-full px-6 sm:px-12 lg:pl-[146px]">
        <h1 className="font-young-serif text-[56px] leading-[1.1] tracking-[-1.6px] sm:text-[72px] lg:text-[80px]">
          oops!
          <br />
          gia&rsquo;s not here.
        </h1>
        <Button href="/" variant="whiteStatic" withArrow className="mt-14">
          TAKE ME BACK
        </Button>
      </div>
    </main>
  );
}
