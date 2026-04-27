/**
 * Renders a translated title with the text after `|` rendered in gradient.
 * e.g. "Projects & |Platforms" → "Projects & <span.text-gradient>Platforms</span>"
 * Works across locales — translators place the `|` wherever the accent word sits.
 */
export function GradientTitle({ raw }: { raw: string }) {
  const idx = raw.indexOf("|");
  if (idx === -1) return <>{raw}</>;
  const before = raw.slice(0, idx);
  const highlight = raw.slice(idx + 1);
  return (
    <>
      {before}
      <span className="text-gradient">{highlight}</span>
    </>
  );
}
