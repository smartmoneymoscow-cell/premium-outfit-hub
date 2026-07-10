import { Link } from "@tanstack/react-router";
import { formatPrice, type Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
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
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
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
  );
}
