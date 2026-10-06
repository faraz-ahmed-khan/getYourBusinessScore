import Image from 'next/image';

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

/** Official GYBS lockup (shield + wordmark). */
export function Logo({
  width = 168,
  height = 48,
  className = '',
  priority = false,
}: LogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="GYBS — Get Your Business Score, a Misconi USA Readiness System"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`.trim()}
      priority={priority}
    />
  );
}
