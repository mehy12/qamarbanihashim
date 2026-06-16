const UPI_ID = 'meesamhyder2005-1@oksbi';
const UPI_PAYEE_NAME = 'MEESAM HYDER';

function generateTxnRef(): string {
  return 'QBH' + Date.now() + Math.random().toString(36).slice(2, 6);
}

/** UPI URL for QR code and generic "open any UPI app" */
export function generateUPIUrl(amount: number): string {
  const tr = generateTxnRef();
  return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${amount.toFixed(2)}&cu=INR&tr=${tr}&mc=0000&tn=${encodeURIComponent('Hadiya Sabeel')}`;
}

/**
 * Intent URL to open a SPECIFIC app on Android.
 * The key is: intent://pay?<upi_params>#Intent;scheme=upi;package=<app_package>;end
 *
 * This is the ONLY reliable way to target a specific UPI app from a web browser.
 * Plain upi://pay opens whatever app is the default handler (e.g. WhatsApp).
 *
 * Reference: https://stackoverflow.com/questions/61852954/how-to-invoke-upi-payment-apps-from-url
 */
export function generateIntentUrl(amount: number, app: 'gpay' | 'phonepe' | 'paytm'): string {
  const tr = generateTxnRef();
  const params = `pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${amount.toFixed(2)}&cu=INR&tr=${tr}&mc=0000&tn=${encodeURIComponent('Hadiya Sabeel')}`;

  const packages: Record<string, string> = {
    gpay: 'com.google.android.apps.nbu.paisa.user',
    phonepe: 'com.phonepe.app',
    paytm: 'net.one97.paytm',
  };

  return `intent://pay?${params}#Intent;scheme=upi;package=${packages[app]};end`;
}

export function getUPIId(): string {
  return UPI_ID;
}
