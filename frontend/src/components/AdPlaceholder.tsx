interface AdPlaceholderProps {
  size: "728x90" | "300x250" | "300x600" | "320x50";
  className?: string;
}

const sizeMap: Record<string, { w: string; h: string }> = {
  "728x90": { w: "w-full max-w-[728px]", h: "h-[90px]" },
  "300x250": { w: "w-[300px]", h: "h-[250px]" },
  "300x600": { w: "w-[300px]", h: "h-[600px]" },
  "320x50": { w: "w-full max-w-[320px]", h: "h-[50px]" },
};

export function AdPlaceholder({ size, className = "" }: AdPlaceholderProps) {
  const dims = sizeMap[size];
  return (
    <div
      className={`${dims.w} ${dims.h} mx-auto flex items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 text-xs text-muted-foreground select-none ${className}`}
    >
      Ad Space — {size}
    </div>
  );
}
