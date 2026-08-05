export function capitalizeFirst(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  const match = trimmed.match(/[\p{L}\p{N}]/u);
  if (!match || match.index === undefined) return trimmed;
  const i = match.index;
  return trimmed.slice(0, i) + trimmed[i].toUpperCase() + trimmed.slice(i + 1);
}
