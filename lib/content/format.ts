/**
 * Display formatters used across the marketing routes.
 * en-GB cadence — Lagos / Federal English defaults to long-form European date.
 */

export function formatPublishDate(
  iso: string | null | undefined
): { display: string; isoDay: string } {
  if (!iso) return { display: "", isoDay: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime()))
    return { display: iso, isoDay: iso.slice(0, 10) };
  return {
    display: d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    isoDay: d.toISOString().slice(0, 10),
  };
}

const ROMAN_MAP: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(n: number): string {
  if (n <= 0) return "";
  let value = n;
  let out = "";
  for (const [v, s] of ROMAN_MAP) {
    while (value >= v) {
      out += s;
      value -= v;
    }
  }
  return out;
}

/** Pull a clean array of `{label, value}` from an unknown JSON column. */
export function asLabelValueList(
  raw: unknown
): { label: string; value: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (x): x is { label: string; value: string } =>
      Boolean(x) &&
      typeof x === "object" &&
      "label" in x &&
      "value" in x &&
      typeof (x as { label: unknown }).label === "string" &&
      typeof (x as { value: unknown }).value === "string"
  );
}

/** A predictable "PROJECT 01" prefix, regardless of input width. */
export function projectIndexLabel(i: number): string {
  return String(i + 1).padStart(2, "0");
}
