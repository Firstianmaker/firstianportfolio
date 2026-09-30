export function MediaPlaceholder({ label, portrait = false }: { label: string; portrait?: boolean }) {
  return <div className={`media-placeholder ${portrait ? "portrait-placeholder" : ""}`} role="img" aria-label={label + ", image not added yet"}>
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><rect x="9" y="9" width="46" height="46" rx="4" stroke="currentColor" strokeWidth="1.5" /><circle cx="24" cy="24" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="m10 47 15-15 9 9 8-8 12 14" stroke="currentColor" strokeWidth="1.5" /></svg>
    <span>{label}</span><small>Image not added yet</small>
  </div>;
}
