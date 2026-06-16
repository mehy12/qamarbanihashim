const UPI_ID = 'meesamhyder2005-1@oksbi';
const PAYEE_NAME = 'Qamar E Bani Hashim';

function generateTxnId(): string {
  return 'QMR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function generateUPIUrl(amount: number): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: 'Hadiya Sabeel',
    tr: generateTxnId(),
    mode: '05',
  });
  return `upi://pay?${params.toString()}`;
}

export function getGPayDeepLink(amount: number): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: 'Hadiya Sabeel',
    tr: generateTxnId(),
    mode: '05',
  });

  // iOS uses gpay://, Android uses tez://
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const scheme = isIOS ? 'gpay://upi/pay' : 'tez://upi/pay';
  return `${scheme}?${params.toString()}`;
}

export function getPhonePeDeepLink(amount: number): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: 'Hadiya Sabeel',
    tr: generateTxnId(),
    mode: '05',
  });
  return `phonepe://pay?${params.toString()}`;
}

export function getUPIId(): string {
  return UPI_ID;
}

/**
 * Opens a deep link reliably on both iOS and Android.
 * iOS blocks window.location.href for custom schemes from JS,
 * so we use a temporary <a> tag click instead.
 */
export function openDeepLink(url: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  // Clean up after a short delay
  setTimeout(() => document.body.removeChild(a), 100);
}
