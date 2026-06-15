import { randomBytes } from 'crypto';

export function generateProtocol(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  return Array.from(randomBytes(7))
    .map((byte) => chars[byte % chars.length])
    .join('');
}
