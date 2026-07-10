import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Truck, ShieldCheck, RefreshCw, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — ${loaderData.product.brand}` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
          { property: "og:type", content: "product" },
        ]
      : [{ title: "Товар — Заказ с YouDo" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-x py-40 text-center">
      <h1 className="font-display text-4xl mb-4">Товар не найден</h1>
      <Link to="/catalog" className="underline">Вернуться в каталог</Link>
    </div>
  ),
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const onAdd = () => {
    if (!size) {
      toast.error("Выберите размер");
      return;
    }
    add(product, size, 1);
    toast.success("Товар добавлен в корзину", {
      description: `${product.brand} · ${product.name} · ${size}`,
      action: { label: "Перейти", onClick: () => (window.location.href = "/cart") },
    });
  };

  return (
    <div className="container-x py-8 animate-page-enter">
      {/* Breadcrumbs */}
      <nav className="text-xs uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-foreground">Главная</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/catalog" search={{ category: product.category }} className="hover:text-foreground">
          {product.category === "women" ? "Женщинам" : product.category === "men" ? "Мужчинам" : "Аксессуары"}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground normal-case tracking-normal">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* GALLERY */}
        <div className="bg-muted aspect-[4/5] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={1000}
            className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* INFO */}
        <div className="animate-hero-subtitle">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {product.brand}
          </div>
          <h1 className="font-display text-3xl md:text-4xl leading-tight">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                <span className="text-destructive text-sm">
                  −{Math.round((1 - product.price / product.oldPrice) * 100)}%
                </span>
              </>
            )}
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Colors */}
          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest mb-3">
              Цвет: <span className="text-muted-foreground normal-case tracking-normal">{color}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c: string) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 text-xs border ${color === c ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-widest">Размер</span>
              <button className="text-xs underline text-muted-foreground">Таблица размеров</button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`py-3 text-sm border ${size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button
              onClick={onAdd}
              className="btn-shine flex-1 bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
            >
              Добавить в корзину
            </button>
            <button
              aria-label="В избранное"
              className="border border-border px-5 hover:border-foreground"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {/* Delivery */}
          <div className="mt-10 border-t border-border pt-6 space-y-4 text-sm">
            <div className="flex gap-3">
              <Truck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div>Доставка СДЭК от 3 дней</div>
                <div className="text-muted-foreground text-xs mt-1">
                  До пункта выдачи или курьером до двери
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div>Гарантия подлинности</div>
                <div className="text-muted-foreground text-xs mt-1">
                  Прямые поставки от бренда
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <RefreshCw className="h-5 w-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div>Возврат в течение 14 дней</div>
                <div className="text-muted-foreground text-xs mt-1">Бесплатно СДЭК</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-3xl mb-8">Вам может понравиться</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
