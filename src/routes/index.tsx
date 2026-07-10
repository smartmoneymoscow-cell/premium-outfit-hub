import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { products } from "@/data/products";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useRef } from "react";
import hero from "@/assets/hero.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catMen from "@/assets/cat-men.jpg";
import catAcc from "@/assets/cat-accessories.jpg";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const newIn = products.filter((p) => p.isNew).slice(0, 4);
  const bestsellers = products.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden hero-section">
        <div className="grid md:grid-cols-2 min-h-[70vh]">
          <div className="order-2 md:order-1 flex items-center px-4 md:px-16 py-12 md:py-16 bg-background hero-text">
            <div className="max-w-lg">
              <div className="animate-hero-title text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                Осень / Зима 2026
              </div>
              <div className="animate-hero-line h-px bg-gold mb-8 w-12" />
              <h1 className="animate-hero-subtitle font-display text-4xl md:text-6xl lg:text-7xl leading-[1.15] md:leading-[1.05]">
                Классика,
                <br />
                <span className="italic text-gold">переосмысленная</span>
                <br />
                заново
              </h1>
              <p className="animate-hero-subtitle mt-6 text-muted-foreground leading-relaxed" style={{ animationDelay: "0.4s" }}>
                Универмаг премиальной одежды и аксессуаров. Кураторская подборка коллекций
                от русских и европейских домов моды с доставкой СДЭК по всей России.
              </p>
              <div className="animate-hero-subtitle mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.6s" }}>
                <Link
                  to="/catalog"
                  className="btn-shine inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                  Смотреть каталог <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/catalog"
                  search={{ category: "women" }}
                  className="btn-shine inline-flex items-center gap-2 border border-foreground px-8 py-4 text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
                >
                  Новая коллекция
                </Link>
              </div>
            </div>
          </div>
          <ParallaxHero />
        </div>
      </section>

      {/* VALUES */}
      <Reveal>
        <section className="border-y border-border">
          <div className="container-x grid grid-cols-2 md:grid-cols-4 gap-6 py-8 text-xs uppercase tracking-widest">
            {[
              { icon: Truck, t: "Доставка СДЭК", s: "По всей России" },
              { icon: ShieldCheck, t: "Гарантия подлинности", s: "100% оригинал" },
              { icon: RefreshCw, t: "Возврат 14 дней", s: "Без вопросов" },
              { icon: CreditCard, t: "Онлайн-оплата", s: "Карта, СБП, рассрочка" },
            ].map((v, i) => (
              <div key={v.t} className="flex items-center gap-3" style={{ animationDelay: `${i * 100}ms` }}>
                <v.icon className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <div>{v.t}</div>
                  <div className="text-muted-foreground normal-case tracking-normal text-[11px] mt-0.5">
                    {v.s}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* CATEGORIES */}
      <section className="container-x py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Категории
              </div>
              <h2 className="font-display text-3xl md:text-5xl">Выберите направление</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { slug: "women", label: "Женщинам", img: catWomen },
            { slug: "men", label: "Мужчинам", img: catMen },
            { slug: "accessories", label: "Аксессуары", img: catAcc },
          ].map((c, i) => (
            <Reveal key={c.slug} delay={i * 120} direction="up">
              <Link
                to="/catalog"
                search={{ category: c.slug }}
                className="group relative block aspect-[3/4] overflow-hidden bg-muted"
              >
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  width={900}
                  height={1200}
                  className="h-full w-full object-cover product-img-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-primary-foreground">
                  <span className="font-display text-2xl">{c.label}</span>
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEW IN */}
      <section className="container-x py-20 border-t border-border">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Новое поступление
              </div>
              <h2 className="font-display text-3xl md:text-5xl">Что мы отобрали для вас</h2>
            </div>
            <Link to="/catalog" className="hidden md:inline-flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gold transition-colors">
              Весь каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 product-grid-responsive">
          {newIn.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="bg-secondary/50">
        <div className="container-x py-20 grid md:grid-cols-2 gap-12 items-center">
          <Reveal direction="left">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Философия
              </div>
              <h2 className="font-display text-3xl md:text-5xl leading-tight">
                Меньше вещей.<br />
                <span className="italic text-gold">Больше смысла.</span>
              </h2>
              <p className="mt-6 text-muted-foreground leading-relaxed max-w-lg">
                Мы верим в осознанный гардероб — вещи, которые служат годами, а не сезонами.
                Каждая позиция в универмаге отобрана вручную: натуральные ткани, честный крой,
                выверенные пропорции.
              </p>
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 mt-8 text-sm uppercase tracking-widest border-b border-foreground pb-1 hover:text-gold hover:border-gold transition-colors"
              >
                Узнать больше
              </Link>
            </div>
          </Reveal>
          <Reveal direction="right">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={catWomen}
                alt=""
                loading="lazy"
                width={900}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="container-x py-20">
        <Reveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
                Хиты продаж
              </div>
              <h2 className="font-display text-3xl md:text-5xl">Выбор редакции</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 product-grid-responsive">
          {bestsellers.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  );
}

/* Parallax hero image component */
function ParallaxHero() {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return;
      const scrollY = window.scrollY;
      const offset = scrollY * 0.15;
      imgRef.current.style.transform = `translateY(${offset}px) scale(1.05)`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="order-1 md:order-2 relative min-h-[420px] md:min-h-full overflow-hidden">
      <div ref={imgRef} className="absolute inset-0 transition-transform duration-100 ease-out">
        <img
          src={hero}
          alt="Осенне-зимняя коллекция 2026"
          width={1600}
          height={1200}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
