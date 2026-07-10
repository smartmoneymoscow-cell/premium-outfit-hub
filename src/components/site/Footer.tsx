export function Footer() {
  return (
    <footer className="border-t border-border mt-24 bg-secondary/40">
      <div className="container-x py-16 grid gap-10 md:grid-cols-4 text-sm">
        <div>
          <div className="font-display text-2xl">Заказ с <span className="italic text-gold">YouDo</span></div>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Универмаг премиальной одежды. Тщательный отбор коллекций, доставка по всей России.
          </p>
        </div>
        <div>
          <h4 className="uppercase tracking-widest text-xs mb-4">Покупателям</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>Доставка СДЭК</li>
            <li>Оплата и рассрочка</li>
            <li>Возврат и обмен</li>
            <li>Таблица размеров</li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase tracking-widest text-xs mb-4">Компания</h4>
          <ul className="space-y-2 text-muted-foreground">
            <li>О бренде</li>
            <li>Магазины</li>
            <li>Контакты</li>
            <li>Пресса</li>
          </ul>
        </div>
        <div>
          <h4 className="uppercase tracking-widest text-xs mb-4">Рассылка</h4>
          <p className="text-muted-foreground mb-3">
            Новые коллекции и приватные распродажи
          </p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 bg-background border border-border px-3 h-10 text-sm outline-none focus:border-foreground"
            />
            <button className="bg-primary text-primary-foreground uppercase tracking-widest text-xs px-4">
              OK
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© 2026 Заказ с YouDo. Все права защищены.</span>
          <div className="flex gap-4">
            <span>Visa</span>
            <span>MasterCard</span>
            <span>МИР</span>
            <span>СБП</span>
            <span>СДЭК</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
