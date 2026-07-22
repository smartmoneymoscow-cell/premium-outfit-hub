import type { SizeChartEntry } from "@/data/products";

export type UserParams = {
  height: number; // см
  weight?: number; // кг (опционально)
};

/**
 * Рекомендует размер на основе роста пользователя и размерной сетки товара.
 * Возвращает { recommended, tooSmall, alternative }.
 */
export function recommendSize(
  user: UserParams,
  sizeChart: SizeChartEntry[],
): {
  recommended: SizeChartEntry | null;
  tooSmall: boolean;
  alternative: SizeChartEntry | null;
  message: string;
} {
  if (!sizeChart.length) {
    return {
      recommended: null,
      tooSmall: false,
      alternative: null,
      message: "Размерная сетка недоступна",
    };
  }

  // Ищем размер, где рост попадает в диапазон
  const exact = sizeChart.find(
    (s) => user.height >= s.minHeight && user.height <= s.maxHeight,
  );

  if (exact) {
    return {
      recommended: exact,
      tooSmall: false,
      alternative: null,
      message: `Рост ${user.height} см → рекомендуем размер ${exact.size}`,
    };
  }

  // Рост выше максимального — берём самый большой размер
  const maxEntry = sizeChart[sizeChart.length - 1];
  if (user.height > maxEntry.maxHeight) {
    const oneDown = sizeChart.length >= 2 ? sizeChart[sizeChart.length - 2] : null;
    return {
      recommended: maxEntry,
      tooSmall: false,
      alternative: null,
      message: `Рост ${user.height} см — подойдёт размер ${maxEntry.size} (самый большой в наличии)`,
    };
  }

  // Рост ниже минимального — берём самый маленький, но предупреждаем
  const minEntry = sizeChart[0];
  if (user.height < minEntry.minHeight) {
    return {
      recommended: minEntry,
      tooSmall: true,
      alternative: null,
      message: `Рост ${user.height} см — размер ${minEntry.size} может оказаться великоват. Рекомендуем примерить в магазине.`,
    };
  }

  // Рост между диапазонами — ближайший по расстоянию до центра
  let best = sizeChart[0];
  let bestDist = Infinity;
  for (const entry of sizeChart) {
    const center = (entry.minHeight + entry.maxHeight) / 2;
    const dist = Math.abs(user.height - center);
    if (dist < bestDist) {
      bestDist = dist;
      best = entry;
    }
  }

  // Проверяем, не слишком ли маленький
  const tooSmall = user.height > best.maxHeight + 3;
  const altIdx = sizeChart.indexOf(best) + 1;
  const alternative = tooSmall && altIdx < sizeChart.length ? sizeChart[altIdx] : null;

  return {
    recommended: best,
    tooSmall,
    alternative,
    message: tooSmall
      ? `Рост ${user.height} см — размер ${best.size} может оказаться тесным. Рекомендуем ${alternative?.size || "следующий размер"}.`
      : `Рост ${user.height} см → рекомендуем размер ${best.size}`,
  };
}

/**
 * Размерная сетка по умолчанию (универсальная, если у товара нет своей).
 * Женская одежда.
 */
export const defaultWomenSizeChart: SizeChartEntry[] = [
  { size: "XS", minHeight: 155, maxHeight: 162, chest: 80, waist: 60, hips: 86 },
  { size: "S",  minHeight: 160, maxHeight: 167, chest: 84, waist: 64, hips: 90 },
  { size: "M",  minHeight: 165, maxHeight: 172, chest: 88, waist: 68, hips: 94 },
  { size: "L",  minHeight: 170, maxHeight: 177, chest: 92, waist: 72, hips: 98 },
  { size: "XL", minHeight: 175, maxHeight: 182, chest: 96, waist: 76, hips: 102 },
];

/**
 * Мужская одежда.
 */
export const defaultMenSizeChart: SizeChartEntry[] = [
  { size: "46", minHeight: 165, maxHeight: 172, chest: 92, waist: 78, hips: 96 },
  { size: "48", minHeight: 170, maxHeight: 177, chest: 96, waist: 82, hips: 100 },
  { size: "50", minHeight: 175, maxHeight: 182, chest: 100, waist: 86, hips: 104 },
  { size: "52", minHeight: 178, maxHeight: 185, chest: 104, waist: 90, hips: 108 },
  { size: "54", minHeight: 180, maxHeight: 190, chest: 108, waist: 94, hips: 112 },
];

/**
 * Джинсы женские (по росту).
 */
export const defaultWomenJeansChart: SizeChartEntry[] = [
  { size: "25", minHeight: 155, maxHeight: 160, waist: 60, hips: 86 },
  { size: "26", minHeight: 158, maxHeight: 164, waist: 63, hips: 89 },
  { size: "27", minHeight: 161, maxHeight: 167, waist: 66, hips: 92 },
  { size: "28", minHeight: 164, maxHeight: 170, waist: 69, hips: 95 },
  { size: "29", minHeight: 167, maxHeight: 174, waist: 72, hips: 98 },
  { size: "30", minHeight: 170, maxHeight: 178, waist: 75, hips: 101 },
];

/**
 * Обувь (условная, по росту — для демонстрации).
 */
export const defaultShoeChart: SizeChartEntry[] = [
  { size: "36", minHeight: 155, maxHeight: 162 },
  { size: "37", minHeight: 160, maxHeight: 167 },
  { size: "38", minHeight: 165, maxHeight: 172 },
  { size: "39", minHeight: 168, maxHeight: 175 },
  { size: "40", minHeight: 172, maxHeight: 180 },
  { size: "41", minHeight: 176, maxHeight: 188 },
];
