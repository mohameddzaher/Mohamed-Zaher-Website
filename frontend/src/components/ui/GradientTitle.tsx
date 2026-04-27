/**
 * Renders a translated title with the text after `|` rendered in the
 * luxury champagne gradient (used for section headlines).
 * e.g. "Projects & |Platforms" → "Projects & <span.text-gold>Platforms</span>"
 */
export function GradientTitle({ raw }: { raw: string }) {
  const idx = raw.indexOf("|");
  if (idx === -1) return <>{raw}</>;
  const before = raw.slice(0, idx);
  const highlight = raw.slice(idx + 1);
  return (
    <>
      {before}
      <span className="text-gold italic">{highlight}</span>
    </>
  );
}
