import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { products, categories, formatPrice } from "@/data/products";
import { z } from "zod";

const searchSchema = z.object({
  category: z.enum(["women", "men", "accessories"]).optional(),
  q: z.string().optional(),
  sale: z.boolean().optional(),
  sort: z.enum(["new", "price_asc", "price_desc"]).optional(),
});

export const Route = createFileRoute("/catalog")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Каталог — Заказ с YouDo" },
      { name: "description", content: "Каталог премиальной одежды, обуви и аксессуаров. Удобные фильтры по категории, цвету и размеру." },
    ],
  }),
  component: Catalog,
});

function Catalog() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [query, setQuery] = useState(search.q ?? "");
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allColors = useMemo(() => Array.from(new Set(products.flatMap((p) => p.colors))), []);
  const allSizes = useMemo(() => Array.from(new Set(products.flatMap((p) => p.sizes))), []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.category) list = list.filter((p) => p.category === search.category);
    if (search.sale) list = list.filter((p) => p.oldPrice);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q),
      );
    }
    if (colors.length) list = list.filter((p) => p.colors.some((c) => colors.includes(c)));
    if (sizes.length) list = list.filter((p) => p.sizes.some((s) => sizes.includes(s)));

    if (search.sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (search.sort === "price_desc") list.sort((a, b) => b.price - a.price);
    if (search.sort === "new") list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return list;
  }, [search.category, search.sale, search.sort, query, colors, sizes]);

  const catLabel =
    categories.find((c) => c.slug === search.category)?.label ??
    (search.sale ? "Скидки" : "Весь каталог");

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  return (
    <div className="container-x py-10 animate-page-enter">
      <Reveal>
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            Каталог
          </div>
          <h1 className="font-display text-4xl md:text-5xl">{catLabel}</h1>
          <div className="mt-2 text-sm text-muted-foreground">
            {filtered.length} {plural(filtered.length, ["товар", "товара", "товаров"])}
          </div>
        </div>
      </Reveal>

      {/* SEARCH + SORT */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: пальто, кашемир, MAISON NORD..."
            className="w-full h-12 pl-11 pr-4 bg-background border border-border focus:border-foreground outline-none text-sm"
          />
        </div>
        <select
          value={search.sort ?? ""}
          onChange={(e) =>
            navigate({
              to: "/catalog",
              search: { ...search, sort: (e.target.value || undefined) as never },
            })
          }
          className="h-12 px-4 bg-background border border-border text-sm uppercase tracking-widest"
        >
          <option value="">Сортировка</option>
          <option value="new">Сначала новинки</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden h-12 px-4 border border-border flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
        >
          <SlidersHorizontal className="h-4 w-4" /> Фильтры
        </button>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-10">
        {/* SIDEBAR FILTERS */}
        <aside
          className={`${mobileOpen ? "fixed inset-0 z-50 bg-background p-6 overflow-auto" : "hidden"} md:block md:static md:p-0`}
        >
          <div className="flex items-center justify-between mb-6 md:hidden">
            <span className="font-display text-2xl">Фильтры</span>
            <button onClick={() => setMobileOpen(false)}><X className="h-5 w-5" /></button>
          </div>

          <FilterBlock title="Категория">
            <button
              onClick={() => navigate({ to: "/catalog", search: {} })}
              className={`block text-sm py-1 ${!search.category && !search.sale ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
            >
              Всё
            </button>
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => navigate({ to: "/catalog", search: { category: c.slug } })}
                className={`block text-sm py-1 ${search.category === c.slug ? "text-gold" : "text-muted-foreground hover:text-foreground"}`}
              >
                {c.label}
              </button>
            ))}
            <button
              onClick={() => navigate({ to: "/catalog", search: { sale: true } })}
              className={`block text-sm py-1 ${search.sale ? "text-gold" : "text-destructive/80 hover:text-destructive"}`}
            >
              Скидки
            </button>
          </FilterBlock>

          <FilterBlock title="Цвет">
            <div className="flex flex-wrap gap-2">
              {allColors.map((c) => (
                <button
                  key={c}
                  onClick={() => toggle(colors, setColors, c)}
                  className={`text-xs px-3 py-1.5 border ${colors.includes(c) ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Размер">
            <div className="flex flex-wrap gap-2">
              {allSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(sizes, setSizes, s)}
                  className={`text-xs px-3 py-1.5 border min-w-[42px] ${sizes.includes(s) ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterBlock>

          <div className="text-xs text-muted-foreground mt-6">
            Цены от {formatPrice(Math.min(...products.map((p) => p.price)))}
          </div>
        </aside>

        {/* PRODUCTS */}
        <div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              По вашему запросу ничего не найдено
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-5">
      <h3 className="text-xs uppercase tracking-widest mb-3">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function plural(n: number, forms: [string, string, string]) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}
