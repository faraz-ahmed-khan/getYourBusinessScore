import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "navy" | "outlineLight" | "outlineDark";

interface BaseProps {
  variant?: Variant;
  size?: "default" | "lg";
  children: ReactNode;
  className?: string;
}

interface LinkButtonProps
  extends BaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> {
  href: string;
}

interface RealButtonProps
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

type ButtonProps = LinkButtonProps | RealButtonProps;

function classesFor(variant: Variant, size: "default" | "lg", extra?: string) {
  return [styles.btn, styles[variant], size === "lg" ? styles.lg : "", extra].filter(Boolean).join(" ");
}

/**
 * Shared button/link. Use `href` for navigation (renders a Next.js <Link>),
 * omit it for an in-page action (renders a real <button>).
 */
export function Button({ variant = "primary", size = "default", children, className, ...rest }: ButtonProps) {
  const classes = classesFor(variant, size, className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as LinkButtonProps;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as RealButtonProps)}>
      {children}
    </button>
  );
}
