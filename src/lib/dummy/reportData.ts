const HANDLE_PATTERN = /^[a-zA-Z0-9._]{2,24}$/;

export function normalizeReportHandle(handle: string): string | null {
  try {
    const normalizedHandle = decodeURIComponent(handle)
      .replace(/^@/, '')
      .trim();

    if (!HANDLE_PATTERN.test(normalizedHandle)) {
      return null;
    }

    return normalizedHandle;
  } catch {
    return null;
  }
}
