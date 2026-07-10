import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { Reveal } from "./Reveal";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  return (
    <Reveal delay={index * 80}>
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="group block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1000}
            className="h-full w-full object-cover product-img-zoom"
          />
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest">
              Новинка
            </span>
          )}
          {product.oldPrice && (
            <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 text-[10px] uppercase tracking-widest">
              −{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </span>
          )}
          {/* Hover overlay with quick-add button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-2 bg-background/90 backdrop-blur px-5 py-2.5 text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <ShoppingBag className="h-3.5 w-3.5" />
              Смотреть
            </span>
          </div>
        </div>
        <div className="pt-4 space-y-1">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </div>
          <div className="text-sm leading-snug line-clamp-2">{product.name}</div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
