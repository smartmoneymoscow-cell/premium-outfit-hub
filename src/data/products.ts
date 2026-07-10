import coat from "@/assets/product-coat.jpg";
import blouse from "@/assets/product-blouse.jpg";
import trousers from "@/assets/product-trousers.jpg";
import sweater from "@/assets/product-sweater.jpg";
import dress from "@/assets/product-dress.jpg";
import sneakers from "@/assets/product-sneakers.jpg";
import bag from "@/assets/product-bag.jpg";
import jeans from "@/assets/product-jeans.jpg";

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: "women" | "men" | "accessories";
  subcategory: string;
  colors: string[];
  sizes: string[];
  description: string;
  isNew?: boolean;
};

export const products: Product[] = [
  {
    id: "coat-camel-01",
    name: "Пальто oversize из шерсти",
    brand: "MAISON NORD",
    price: 48900,
    oldPrice: 62000,
    image: coat,
    category: "women",
    subcategory: "Верхняя одежда",
    colors: ["Бежевый", "Чёрный"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Двубортное пальто свободного кроя из шерсти премиум-класса. Атласная подкладка, роговые пуговицы.",
    isNew: true,
  },
  {
    id: "blouse-silk-02",
    name: "Блуза из натурального шёлка",
    brand: "ATELIER MOSCOW",
    price: 18400,
    image: blouse,
    category: "women",
    subcategory: "Блузы и рубашки",
    colors: ["Молочный"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Классическая блуза из шёлка mulberry с перламутровыми пуговицами и объёмным рукавом.",
  },
  {
    id: "trousers-black-03",
    name: "Брюки классические зауженные",
    brand: "ATELIER MOSCOW",
    price: 22500,
    image: trousers,
    category: "men",
    subcategory: "Брюки",
    colors: ["Чёрный"],
    sizes: ["46", "48", "50", "52", "54"],
    description:
      "Прямые брюки из шерстяной ткани super 120s. Идеальная посадка, стрелки, потайной крючок.",
  },
  {
    id: "sweater-cashmere-04",
    name: "Свитер из кашемира",
    brand: "MAISON NORD",
    price: 34200,
    oldPrice: 41000,
    image: sweater,
    category: "women",
    subcategory: "Трикотаж",
    colors: ["Кэмел", "Молочный", "Графит"],
    sizes: ["S", "M", "L"],
    description:
      "Свободный свитер из 100% монгольского кашемира с высоким воротом.",
    isNew: true,
  },
  {
    id: "dress-black-05",
    name: "Платье-миди облегающее",
    brand: "NOIR STUDIO",
    price: 27800,
    image: dress,
    category: "women",
    subcategory: "Платья",
    colors: ["Чёрный"],
    sizes: ["XS", "S", "M", "L"],
    description:
      "Маленькое чёрное платье из вискозы с эластаном. Универсальный крой для любого случая.",
  },
  {
    id: "sneakers-white-06",
    name: "Кеды из телячьей кожи",
    brand: "STELLA ROSSI",
    price: 32900,
    image: sneakers,
    category: "accessories",
    subcategory: "Обувь",
    colors: ["Белый"],
    sizes: ["36", "37", "38", "39", "40", "41"],
    description:
      "Минималистичные кеды из мягкой кожи наппа. Ручная сборка в Италии.",
  },
  {
    id: "bag-brown-07",
    name: "Сумка-тоут из зернистой кожи",
    brand: "STELLA ROSSI",
    price: 56400,
    image: bag,
    category: "accessories",
    subcategory: "Сумки",
    colors: ["Коньяк", "Чёрный"],
    sizes: ["ONE SIZE"],
    description:
      "Вместительная сумка-тоут с длинным ремнём. Натуральная кожа, латунная фурнитура.",
    isNew: true,
  },
  {
    id: "jeans-blue-08",
    name: "Джинсы прямого кроя",
    brand: "DENIM NORD",
    price: 14900,
    oldPrice: 18900,
    image: jeans,
    category: "women",
    subcategory: "Джинсы",
    colors: ["Синий"],
    sizes: ["25", "26", "27", "28", "29", "30"],
    description:
      "Джинсы с высокой посадкой из плотного денима с эффектом ручной потёртости.",
  },
];

export const categories = [
  { slug: "women", label: "Женщинам" },
  { slug: "men", label: "Мужчинам" },
  { slug: "accessories", label: "Аксессуары" },
] as const;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}
