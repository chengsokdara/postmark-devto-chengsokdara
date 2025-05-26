export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function stringify(obj: any) {
  return JSON.stringify(obj, null, 2);
}
