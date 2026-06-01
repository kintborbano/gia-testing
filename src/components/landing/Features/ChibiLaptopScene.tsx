const GIA_ON_LAPTOP = '/features/gia-on-laptop.png';

export const GIA_SLOT = {
  gridColumn: 1,
  gridRow: 1,
  width: 613,
  height: 394,
  marginLeft: 317,
  marginTop: 0,
} as const;

export default function ChibiLaptopScene(): React.ReactElement {
  return (
    // zIndex keeps the image above the feature icons so they stay hidden
    // behind it until they explode outward.
    <div className="relative" style={{ ...GIA_SLOT, zIndex: 10 }}>
      <img
        alt="GIA on Laptop"
        className="pointer-events-none h-full w-full object-contain"
        src={GIA_ON_LAPTOP}
        style={{ transform: 'scale(1.4)' }}
      />
    </div>
  );
}
