"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "cn";

interface LogoProps {
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
  href?: string;
  withTagline?: boolean;
}

const SIZE_CONFIGS = {
  sm: {
    width: 108,
    height: 36,
    className: "h-7 sm:h-8 w-auto",
  },
  default: {
    width: 132,
    height: 44,
    className: "h-8 sm:h-9 md:h-10 w-auto",
  },
  lg: {
    width: 165,
    height: 55,
    className: "h-10 sm:h-11 md:h-12 w-auto",
  },
  xl: {
    width: 210,
    height: 70,
    className: "h-12 sm:h-14 md:h-16 w-auto",
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
        <Image
          src="/logo.png"
          alt="ECOVEX"
          width={config.width}
          height={config.height}
          priority
          className={cn(
            "object-contain transition-transform duration-200 group-hover:scale-[1.02] dark:brightness-125 dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]",
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
