function readMessage(value: unknown): string | string[] | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const message = (value as Record<string, unknown>).message;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && message.every((m) => typeof m === "string")) {
    return message as string[];
  }
  return undefined;
}

export function extractErrorMessage(
  source: unknown,
  fallback: string
): string | string[] {
  if (typeof source === "object" && source !== null && "response" in source) {
    const response = (source as { response?: { data?: unknown } }).response;
    const fromResponseData = readMessage(response?.data);
    if (fromResponseData !== undefined) return fromResponseData;
  }
  const direct = readMessage(source);
  if (direct !== undefined) return direct;
  return fallback;
}
