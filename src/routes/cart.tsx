import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/data/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Корзина — Заказ с YouDo" },
      { name: "description", content: "Ваша корзина. Оформите заказ с доставкой СДЭК и удобной онлайн-оплатой." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, setQty, remove, total, count } = useCart();
  const delivery = total >= 15000 || total === 0 ? 0 : 490;
  const grand = total + delivery;

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center max-w-md mx-auto">
        <ShoppingBag className="h-14 w-14 mx-auto text-muted-foreground" strokeWidth={1} />
        <h1 className="font-display text-4xl mt-6">Корзина пуста</h1>
        <p className="text-muted-foreground mt-3">
          Загляните в каталог — там немало вещей, которые захочется взять с собой.
        </p>
        <Link
          to="/catalog"
          className="inline-block mt-8 bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-primary/90"
        >
          В каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Оформление
        </div>
        <h1 className="font-display text-4xl md:text-5xl">Корзина</h1>
        <p className="mt-2 text-sm text-muted-foreground">{count} товар(ов)</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* ITEMS */}
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr_auto] gap-4 md:gap-6 py-6">
              <Link to="/product/$id" params={{ id: item.product.id }} className="block bg-muted">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  loading="lazy"
                  width={800}
                  height={1000}
                  className="w-full aspect-[4/5] object-cover"
                />
              </Link>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {item.product.brand}
                </div>
                <Link
                  to="/product/$id"
                  params={{ id: item.product.id }}
                  className="text-sm md:text-base hover:text-gold block mt-1"
                >
                  {item.product.name}
                </Link>
                <div className="text-xs text-muted-foreground mt-2">
                  Размер: {item.size}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="inline-flex items-center border border-border">
                    <button
                      onClick={() => setQty(item.product.id, item.size, item.qty - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-muted"
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-9 text-center text-sm">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.product.id, item.size, item.qty + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-muted"
                      aria-label="Увеличить"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(item.product.id, item.size)}
                    className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Удалить
                  </button>
                </div>
              </div>
              <div className="col-span-2 md:col-span-1 text-right">
                <div className="font-medium">{formatPrice(item.product.price * item.qty)}</div>
                {item.qty > 1 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatPrice(item.product.price)} × {item.qty}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <aside className="lg:sticky lg:top-24 self-start bg-secondary/50 p-6 md:p-8">
          <h2 className="font-display text-2xl mb-6">Итого</h2>
          <div className="space-y-3 text-sm border-b border-border pb-5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Товары ({count})</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Доставка СДЭК</span>
              <span>{delivery === 0 ? "Бесплатно" : formatPrice(delivery)}</span>
            </div>
            {delivery > 0 && (
              <div className="text-xs text-muted-foreground flex items-start gap-2 pt-1">
                <Truck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>До бесплатной доставки: {formatPrice(15000 - total)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between items-baseline py-5">
            <span className="text-base">К оплате</span>
            <span className="text-2xl font-display">{formatPrice(grand)}</span>
          </div>
          <button
            onClick={() => {
              const evt = new CustomEvent("checkout", { detail: { total: grand } });
              window.dispatchEvent(evt);
              alert("Оформление заказа: интеграция онлайн-оплаты и выбор ПВЗ СДЭК подключается на следующем шаге.");
            }}
            className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90"
          >
            Оформить заказ
          </button>
          <Link to="/catalog" className="block text-center mt-4 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground">
            ← Продолжить покупки
          </Link>
          <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground space-y-1.5">
            <div>Оплата картой, СБП или в рассрочку</div>
            <div>Доставка СДЭК по всей России</div>
            <div>Возврат в течение 14 дней</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
