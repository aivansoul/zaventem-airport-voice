import type { CSSProperties } from "react";

type IconSpriteProps = {
  col: number;
  row: number;
  label: string;
  className?: string;
};

export function IconSprite({ col, row, label, className = "" }: IconSpriteProps) {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  const safeCol = Math.min(8, Math.max(1, col));
  const safeRow = Math.min(6, Math.max(1, row));
  const x = ((safeCol - 1) / 7) * 100;
  const y = ((safeRow - 1) / 5) * 100;
  const maskImage = `url("${basePath}/assets/airport-icon-mask.webp")`;
  const maskPosition = `${x}% ${y}%`;
  const style: CSSProperties = {
    backgroundColor: "currentColor",
    maskImage,
    maskPosition,
    maskRepeat: "no-repeat",
    maskSize: "800% 600%",
    WebkitMaskImage: maskImage,
    WebkitMaskPosition: maskPosition,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskSize: "800% 600%",
  };

  return (
    <span
      className={`icon-sprite ${className}`.trim()}
      style={style}
      role="img"
      aria-label={label}
    />
  );
}
