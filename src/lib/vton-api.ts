/**
 * Клиент для VTON API (бэкенд на Render).
 *
 * Архитектура:
 *   Фронтенд → POST /api/tryon (FormData: model_image + product_image)
 *            → GET  /api/tryon/:id (poll до статуса "completed")
 *
 * FASHN API ключ хранится ТОЛЬКО на бэкенде (Render env var).
 */

const API_BASE = import.meta.env.VITE_VTON_API_URL || "http://localhost:3001";

export type TryOnStatus = "starting" | "processing" | "completed" | "failed";

export type TryOnResult = {
  id: string;
};

export type TryOnStatusResponse = {
  status: TryOnStatus;
  output: string | null; // URL результата
  error: string | null;
};

/**
 * Запустить виртуальную примерку.
 * @param modelPhoto  — File (фото пользователя)
 * @param productUrl  — URL фото товара (или base64)
 */
export async function startTryOn(
  modelPhoto: File,
  productImage: File | string,
): Promise<TryOnResult> {
  const form = new FormData();
  form.append("model_image", modelPhoto);

  if (typeof productImage === "string") {
    // Если передан URL — конвертируем в blob
    const resp = await fetch(productImage);
    const blob = await resp.blob();
    form.append("product_image", blob, "product.jpg");
  } else {
    form.append("product_image", productImage);
  }

  const res = await fetch(`${API_BASE}/api/tryon`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Ошибка сервера: ${res.status}`);
  }

  return res.json();
}

/**
 * Poll статуса задачи. Рекурсивно с задержкой.
 */
export async function pollTryOnStatus(
  id: string,
  onStatus?: (status: TryOnStatus) => void,
  maxAttempts = 60,
  intervalMs = 3000,
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${API_BASE}/api/tryon/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(`Status check failed: ${res.status}`);

    const data: TryOnStatusResponse = await res.json();
    onStatus?.(data.status);

    if (data.status === "completed" && data.output) {
      return data.output;
    }
    if (data.status === "failed") {
      throw new Error(data.error || "Примерка не удалась");
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error("Превышено время ожидания (3 мин)");
}
