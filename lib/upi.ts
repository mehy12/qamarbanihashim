const UPI_ID = '6362029195@kotakbank';
const PAYEE_NAME = 'Qamar E Bani Hashim';

export function generateUPIUrl(amount: number): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: 'Hadiya Sabeel',
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
  });
  return `tez://upi/pay?${params.toString()}`;
}

export function getPhonePeDeepLink(amount: number): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: amount.toString(),
    cu: 'INR',
    tn: 'Hadiya Sabeel',
  });
  return `phonepe://pay?${params.toString()}`;
}

export function getUPIId(): string {
  return UPI_ID;
}
