const UPI_ID = 'meesamhyder2005-1@oksbi';
const UPI_PAYEE_NAME = 'Qamar%20E%20Bani%20Hashim';

/**
 * Generate a unique transaction reference ID.
 * UPI apps require this to process intent-based payments properly.
 * Without it, apps reject the payment with misleading errors.
 */
function generateTxnRef(): string {
  return 'QBH' + Date.now() + Math.random().toString(36).slice(2, 6);
}

/**
 * Full UPI URL with all required parameters:
 *   pa  = payee VPA
 *   pn  = payee name (URL-encoded with %20)
 *   am  = amount
 *   cu  = currency
 *   tr  = unique transaction reference (CRITICAL — apps reject without this)
 *   mc  = merchant category code (0000 = generic/personal)
 *   tn  = transaction note (URL-encoded)
 */
export function generateUPIUrl(amount: number): string {
  const tr = generateTxnRef();
  return `upi://pay?pa=${UPI_ID}&pn=${UPI_PAYEE_NAME}&am=${amount.toFixed(2)}&cu=INR&tr=${tr}&mc=0000&tn=Hadiya%20Sabeel`;
}

export function getUPIId(): string {
  return UPI_ID;
}
