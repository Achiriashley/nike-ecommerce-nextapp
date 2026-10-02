import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

// next/image wrapper that also handles uploaded (data URL) and missing images.
export default function ProductImage({ src, alt, className, sizes = "(min-width:1024px) 25vw, 50vw", priority, ...props }) {
  if (!src) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-surface text-neutral-400", className)}>
        <ImageOff className="h-6 w-6" aria-hidden />
        <span className="sr-only">{alt}</span>
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("data:")}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}
