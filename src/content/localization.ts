export type Locale = 'en' | 'id';
export type Localized<T> = { en?: T | null; id?: T | null };

// Foundation for an eventual public switcher. Original English fields stay intact.
export function localizedValue<T>(original: T, translated: Localized<T> | null | undefined, locale: Locale): T {
  const present = (value: T | null | undefined): value is T => value != null &&
    (typeof value !== 'string' || value.trim().length > 0) &&
    (!Array.isArray(value) || value.length > 0);
  const candidate = translated?.[locale];
  if (present(candidate)) return candidate;
  const english = translated?.en;
  return present(english) ? english : original;
}
