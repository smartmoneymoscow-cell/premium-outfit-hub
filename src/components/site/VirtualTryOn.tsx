import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, Ruler, Sparkles, AlertTriangle, Download, RotateCcw } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import {
  recommendSize,
  defaultWomenSizeChart,
  defaultMenSizeChart,
  defaultWomenJeansChart,
  defaultShoeChart,
  type UserParams,
} from "@/lib/size-recommend";
import { startTryOn, pollTryOnStatus, type TryOnStatus } from "@/lib/vton-api";

type Props = {
  product: Product;
  open: boolean;
  onClose: () => void;
};

type Step = "upload" | "params" | "processing" | "result";

function getSizeChart(product: Product) {
  if (product.sizeChart?.length) return product.sizeChart;
  if (product.subcategory === "Джинсы") return defaultWomenJeansChart;
  if (product.subcategory === "Обувь") return defaultShoeChart;
  if (product.category === "men") return defaultMenSizeChart;
  return defaultWomenSizeChart;
}

export function VirtualTryOn({ product, open, onClose }: Props) {
  const [step, setStep] = useState<Step>("upload");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [height, setHeight] = useState<number>(170);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<ReturnType<typeof recommendSize> | null>(null);
  const [tryOnStatus, setTryOnStatus] = useState<TryOnStatus>("starting");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Сброс при закрытии
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("upload");
        setPhoto(null);
        setPhotoPreview(null);
        setHeight(170);
        setSelectedSize(null);
        setRecommendation(null);
        setResultUrl(null);
        setError(null);
        setTryOnStatus("starting");
      }, 300);
    }
  }, [open]);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Загрузите изображение (JPG, PNG)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Файл слишком большой (макс. 10 МБ)");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const goNext = () => {
    if (step === "upload" && photo) {
      setStep("params");
    } else if (step === "params") {
      // Вычисляем рекомендацию
      const chart = getSizeChart(product);
      const rec = recommendSize({ height }, chart);
      setRecommendation(rec);
      setSelectedSize(rec.recommended?.size || product.sizes[0]);
    }
  };

  const startFitting = async () => {
    if (!photo || !selectedSize) return;
    setStep("processing");
    setError(null);

    try {
      const { id } = await startTryOn(photo, product.image);
      const url = await pollTryOnStatus(id, (s) => setTryOnStatus(s));
      setResultUrl(url);
      setStep("result");
    } catch (err: any) {
      setError(err.message || "Произошла ошибка");
      setStep("params");
    }
  };

  const resetAll = () => {
    setStep("upload");
    setPhoto(null);
    setPhotoPreview(null);
    setResultUrl(null);
    setError(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl">Виртуальная примерочная</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product info bar */}
        <div className="px-6 py-3 bg-secondary/30 border-b border-border flex items-center gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-14 h-17 object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </div>
            <div className="text-sm truncate">{product.name}</div>
          </div>
          <div className="text-sm font-medium">{formatPrice(product.price)}</div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* STEP 1: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-display mb-2">Загрузите ваше фото</h3>
                <p className="text-sm text-muted-foreground">
                  Полный рост, лицом к камере, на однотонном фоне. Результат будет точнее.
                </p>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className="relative border-2 border-dashed border-border hover:border-foreground transition-colors cursor-pointer aspect-[3/4] max-h-[400px] flex flex-col items-center justify-center gap-4"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Ваше фото"
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <div className="text-center">
                      <div className="text-sm font-medium">Нажмите или перетащите фото</div>
                      <div className="text-xs text-muted-foreground mt-1">JPG, PNG до 10 МБ</div>
                    </div>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </div>

              <button
                onClick={goNext}
                disabled={!photo}
                className="w-full btn-shine bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Далее — указать параметры
              </button>
            </div>
          )}

          {/* STEP 2: Params + Size */}
          {step === "params" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-display mb-2">Ваши параметры</h3>
                <p className="text-sm text-muted-foreground">
                  Укажите рост — мы подберём подходящий размер.
                </p>
              </div>

              {/* Photo preview + height slider */}
              <div className="grid grid-cols-[120px_1fr] gap-6">
                {photoPreview && (
                  <img
                    src={photoPreview}
                    alt=""
                    className="w-full aspect-[3/4] object-cover"
                  />
                )}
                <div className="space-y-6">
                  {/* Height */}
                  <div>
                    <label className="flex items-center gap-2 text-xs uppercase tracking-widest mb-3">
                      <Ruler className="h-4 w-4" />
                      Рост: <span className="text-foreground font-medium">{height} см</span>
                    </label>
                    <input
                      type="range"
                      min={145}
                      max={200}
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full accent-foreground"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>145</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Size recommendation */}
                  {recommendation && (
                    <div
                      className={`p-4 border ${
                        recommendation.tooSmall
                          ? "border-destructive/40 bg-destructive/5"
                          : "border-border bg-secondary/30"
                      }`}
                    >
                      <div className="text-sm mb-3">{recommendation.message}</div>

                      {/* Size selector */}
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => {
                          const isRecommended = s === recommendation.recommended?.size;
                          const isAlternative = s === recommendation.alternative?.size;
                          return (
                            <button
                              key={s}
                              onClick={() => setSelectedSize(s)}
                              className={`px-4 py-2 text-sm border transition-colors ${
                                selectedSize === s
                                  ? "border-foreground bg-foreground text-background"
                                  : isRecommended
                                  ? "border-gold bg-gold/10 hover:border-foreground"
                                  : isAlternative
                                  ? "border-destructive/50 bg-destructive/5 hover:border-foreground"
                                  : "border-border hover:border-foreground"
                              }`}
                            >
                              {s}
                              {isRecommended && (
                                <span className="block text-[10px] mt-0.5 opacity-70">рекомендуем</span>
                              )}
                              {isAlternative && (
                                <span className="block text-[10px] mt-0.5 text-destructive opacity-70">альтернатива</span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {recommendation.tooSmall && recommendation.alternative && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-destructive">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Рекомендуем примерить размер {recommendation.alternative.size}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("upload")}
                  className="px-6 py-3 border border-border text-sm uppercase tracking-widest hover:bg-muted transition-colors"
                >
                  Назад
                </button>
                <button
                  onClick={startFitting}
                  disabled={!selectedSize}
                  className="flex-1 btn-shine bg-primary text-primary-foreground py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Примерить {selectedSize && `(${selectedSize})`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Processing */}
          {step === "processing" && (
            <div className="flex flex-col items-center justify-center py-16 gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-gold/30 animate-spin border-t-gold" />
                <Sparkles className="absolute inset-0 m-auto h-8 w-8 text-gold" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-xl mb-2">Примеряем...</h3>
                <p className="text-sm text-muted-foreground">
                  {tryOnStatus === "starting" && "Подготавливаем изображения..."}
                  {tryOnStatus === "processing" && "Нейросеть генерирует результат..."}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Обычно занимает 15–45 секунд
              </div>
            </div>
          )}

          {/* STEP 4: Result */}
          {step === "result" && resultUrl && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-display mb-2">Результат примерки</h3>
                <p className="text-sm text-muted-foreground">
                  Размер {selectedSize} · Рост {height} см
                </p>
              </div>

              <div className="relative">
                <img
                  src={resultUrl}
                  alt="Результат виртуальной примерки"
                  className="w-full max-h-[500px] object-contain bg-muted"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={resetAll}
                  className="px-6 py-3 border border-border text-sm uppercase tracking-widest hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Ещё раз
                </button>
                <a
                  href={resultUrl}
                  download="tryon-result.png"
                  className="px-6 py-3 border border-border text-sm uppercase tracking-widest hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Скачать
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 btn-shine bg-primary text-primary-foreground py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                  Готово
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
