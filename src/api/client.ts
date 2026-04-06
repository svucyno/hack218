export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000';

type ApiRequestOptions = RequestInit & {
  skipJsonHeader?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipJsonHeader = false, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(skipJsonHeader ? {} : { 'Content-Type': 'application/json' }),
      ...(headers ?? {}),
    },
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('The server returned an unreadable response.');
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'detail' in data && typeof data.detail === 'string'
        ? data.detail
        : 'Unable to reach MedBridge right now.';
    throw new Error(message);
  }

  return data as T;
}
