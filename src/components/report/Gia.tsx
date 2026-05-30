// GIA HEAD ICON — replace SVG with final asset when design is ready

export default function Gia() {
  return (
    <div className="mb-12 flex justify-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="text-blue-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="3" />

        {/* Head shape */}
        <circle
          cx="60"
          cy="50"
          r="28"
          fill="currentColor"
          opacity="0.1"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Eyes */}
        <circle cx="50" cy="45" r="3" fill="currentColor" />
        <circle cx="70" cy="45" r="3" fill="currentColor" />

        {/* Smile arc */}
        <path
          d="M 50 55 Q 60 62 70 55"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Initial "G" in center */}
        <text
          x="60"
          y="75"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="32"
          fontWeight="bold"
          fill="currentColor"
        >
          G
        </text>
      </svg>
    </div>
  );
}
