"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "cn";
import logoLight from "@/public/brand-logo.png";
import logoDark from "@/public/brand-logo-dark.png";

interface LogoProps {
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  href?: string;
  withTagline?: boolean;
}

const SIZE_CONFIGS = {
  sm: {
    className: "h-8 sm:h-9 w-auto",
  },
  default: {
    className: "h-9 sm:h-10 md:h-11 w-auto",
  },
  lg: {
    className: "h-11 sm:h-12 md:h-13 w-auto",
  },
  xl: {
    className: "h-14 sm:h-16 md:h-20 w-auto",
  },
};

export function Logo({
  size = "default",
  className,
  href = "/",
  withTagline = false,
}: LogoProps) {
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.default;

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 group select-none shrink-0 transition-all duration-200 hover:opacity-95 active:scale-[0.98]",
        className
      )}
      aria-label="ECOVEX - Plateforme de tri et recyclage écologique"
    >
      <div className="relative flex items-center justify-center shrink-0">
        {/* Light mode logo (with dark typography) */}
        <Image
          src={logoLight}
          alt="ECOVEX"
          priority
          className={cn(
            "object-contain transition-transform duration-200 group-hover:scale-[1.02] block dark:hidden",
            config.className
          )}
        />
        {/* Dark mode logo (with bright cream typography and glowing leaf) */}
        <Image
          src={logoDark}
          alt="ECOVEX"
          priority
          className={cn(
            "object-contain transition-transform duration-200 group-hover:scale-[1.02] hidden dark:block",
            config.className
          )}
        />
      </div>
      {withTagline && (
        <span className="hidden sm:inline-block text-[11px] font-semibold text-muted-foreground border-s border-border/80 ps-2 ms-0.5 tracking-tight">
          Algérie
        </span>
      )}
    </Link>
  );
}
