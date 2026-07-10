import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { categories } from "@/data/products";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
      <div className="container-x flex items-center justify-between h-14 text-xs tracking-widest uppercase text-muted-foreground">
        <span>Бесплатная доставка СДЭК от 15 000 ₽</span>
        <div className="hidden md:flex gap-6">
          <a href="#">Помощь</a>
          <a href="#">Магазины</a>
          <a href="#">RU / ₽</a>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x flex items-center justify-between h-20 gap-8">
          <div className="flex-1 hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.18em]">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/catalog"
                search={{ category: c.slug }}
                className="hover:text-gold transition-colors"
              >
                {c.label}
              </Link>
            ))}
            <Link to="/catalog" search={{ sale: true }} className="text-destructive hover:opacity-70">
              Sale
            </Link>
          </div>
          <Link to="/" className="font-display text-2xl md:text-3xl tracking-tight whitespace-nowrap">
            Заказ с <span className="italic text-gold">YouDo</span>
          </Link>
          <div className="flex-1 flex items-center justify-end gap-5">
            <Link to="/catalog" aria-label="Поиск" className="hover:text-gold">
              <Search className="h-5 w-5" />
            </Link>
            <button aria-label="Избранное" className="hidden md:block hover:text-gold">
              <Heart className="h-5 w-5" />
            </button>
            <button aria-label="Аккаунт" className="hidden md:block hover:text-gold">
              <User className="h-5 w-5" />
            </button>
            <Link to="/cart" aria-label="Корзина" className="relative hover:text-gold">
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <nav className="md:hidden border-t border-border">
        <div className="container-x flex justify-between py-3 text-xs uppercase tracking-widest">
          {categories.map((c) => (
            <Link key={c.slug} to="/catalog" search={{ category: c.slug }}>
              {c.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
