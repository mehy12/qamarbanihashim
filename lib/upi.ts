const UPI_ID = 'meesamhyder2005-1@oksbi';
const PAYEE_NAME = 'Qamar E Bani Hashim';

export type Platform = 'android' | 'ios' | 'unknown';

/**
 * Detect whether the user is on Android, iOS, or something else.
 * Must be called client-side (needs navigator.userAgent).
 */
export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  return 'unknown';
}

/**
 * Build query string manually to avoid URLSearchParams encoding @ as %40
 * which causes UPI apps to reject or mishandle the payment.
 */
function buildUPIQuery(amount: number): string {
  return `pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Hadiya Sabeel')}`;
}

/** Standard UPI deep link — opens system app chooser on both Android & iOS */
export function generateUPIUrl(amount: number): string {
  return `upi://pay?${buildUPIQuery(amount)}`;
}

/**
 * Google Pay deep link.
 *   Android → intent:// with GPay package (most reliable)
 *   iOS     → gpay://upi/pay (GPay registers this custom scheme on iOS)
 */
export function getGPayDeepLink(amount: number, platform: Platform): string {
  if (platform === 'ios') {
    return `gpay://upi/pay?${buildUPIQuery(amount)}`;
  }
  // Android & fallback
  return `intent://pay?${buildUPIQuery(amount)}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`;
}

/**
 * PhonePe deep link.
 *   Android → intent:// with PhonePe package
 *   iOS     → phonepe://pay (PhonePe registers this scheme on iOS)
 */
export function getPhonePeDeepLink(amount: number, platform: Platform): string {
  if (platform === 'ios') {
    return `phonepe://pay?${buildUPIQuery(amount)}`;
  }
  return `intent://pay?${buildUPIQuery(amount)}#Intent;scheme=upi;package=com.phonepe.app;end`;
}

/**
 * Paytm deep link.
 *   Android → intent:// with Paytm package
 *   iOS     → paytmmp://pay (Paytm registers this scheme on iOS)
 */
export function getPaytmDeepLink(amount: number, platform: Platform): string {
  if (platform === 'ios') {
    return `paytmmp://pay?${buildUPIQuery(amount)}`;
  }
  return `intent://pay?${buildUPIQuery(amount)}#Intent;scheme=upi;package=net.one97.paytm;end`;
}

export function getUPIId(): string {
  return UPI_ID;
}
