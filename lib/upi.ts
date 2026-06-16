const UPI_ID = 'meesamhyder2005-1@oksbi';
const UPI_PAYEE_NAME = 'Qamar E Bani Hashim';

/**
 * Standard UPI deep link — matches the exact format that works
 * across GPay, PhonePe, Paytm on both Android & iOS.
 *
 * Key: no encodeURIComponent, no tn parameter, just the bare minimum.
 */
export function generateUPIUrl(amount: number): string {
  return `upi://pay?pa=${UPI_ID}&pn=${UPI_PAYEE_NAME}&am=${amount}&cu=INR`;
}

export function getUPIId(): string {
  return UPI_ID;
}
