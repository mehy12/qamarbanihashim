const UPI_ID = 'meesamhyder2005-1@oksbi';
const PAYEE_NAME = 'Qamar E Bani Hashim';

export function generateUPIUrl(amount: number): string {
  // Build the URL manually to avoid URLSearchParams encoding
  // which can cause issues with stricter QR scanners (like GPay).
  // GPay expects minimal, cleanly formatted UPI strings.
  const pa = UPI_ID;
  const pn = encodeURIComponent(PAYEE_NAME);
  const am = amount.toFixed(2);
  const tn = encodeURIComponent('Hadiya Sabeel');
  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}

export function getUPIId(): string {
  return UPI_ID;
}

export function openDeepLink(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => document.body.removeChild(a), 100);
}
