const UPI_ID = 'meesamhyder2005-1@oksbi';
const UPI_PAYEE_NAME = 'Qamar E Bani Hashim';

/** UPI payload for QR code only — not for clickable links */
export function generateUPIUrl(amount: number): string {
  return `upi://pay?pa=${UPI_ID}&pn=${UPI_PAYEE_NAME}&am=${amount}&cu=INR`;
}

/** Copy UPI ID to clipboard then open a specific app */
export async function copyAndOpenApp(
  app: 'gpay' | 'phonepe' | 'paytm' | 'any'
): Promise<void> {
  try {
    await navigator.clipboard.writeText(UPI_ID);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = UPI_ID;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  const schemes: Record<string, string> = {
    gpay: 'gpay://upi/',
    phonepe: 'phonepe://',
    paytm: 'paytmmp://',
    any: `upi://pay?pa=${UPI_ID}&pn=${UPI_PAYEE_NAME}&cu=INR`,
  };

  window.location.href = schemes[app];
}

export function getUPIId(): string {
  return UPI_ID;
}
