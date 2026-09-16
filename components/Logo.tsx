export function Logo({ width = 38, height = 44 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 116" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 2 L96 18 V56 C96 88 76 106 50 114 C24 106 4 88 4 56 V18 Z" fill="none" stroke="#c9962c" strokeWidth="5" />
      <path d="M50 10 L88 23 V56 C88 82 71 98 50 105 L50 10 Z" fill="#122f50" />
      <path d="M50 10 L12 23 V56 C12 82 29 98 50 105 L50 10 Z" fill="#a51c2c" />
    </svg>
  );
}
