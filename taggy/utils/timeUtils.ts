import { Timestamp } from 'firebase/firestore';

export function calculateRemainingTime(timeout: Timestamp | Date): string {
  const now = Date.now();
  const timeoutDate = timeout instanceof Timestamp ? timeout.toDate().getTime() : timeout.getTime();
  const remainingTime = timeoutDate - now;

  if (remainingTime <= 0) {
    return 'Expired';
  }

  const minutes = Math.floor(remainingTime / (1000 * 60)) % 60;
  const hours = Math.floor(remainingTime / (1000 * 60 * 60));

  return `${hours}h ${minutes}m remaining`;
}