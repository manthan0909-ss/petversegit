import logoAsset from "@/assets/petverse-logo.png.asset.json";
import { cn } from "@/lib/utils";

/** Icon + wordmark artwork, shown in full (never cropped). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="PetVerse logo"
      className={cn("h-12 w-auto object-contain", className)}
    />
  );
}

/** Full logo (icon + wordmark). On dark sidebars, place on a white rounded chip. */
export function LogoFull({
  className,
  onDark,
  size = "md",
}: {
  className?: string;
  onDark?: boolean;
  size?: "md" | "lg" | "hero";
}) {
  const h = size === "hero" ? "h-40 sm:h-52" : size === "lg" ? "h-20" : "h-14";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-2xl px-2 py-1",
        onDark && "bg-white/95",
        className,
      )}
    >
      <img
        src={logoAsset.url}
        alt="PetVerse — One App. Every Pet. Every Need."
        className={cn(h, "w-auto object-contain")}
      />
    </span>
  );
}
