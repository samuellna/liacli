import { randomUUID } from 'crypto';

export function generateProtocol(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  const random = randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();

  return `SAM-${date}-${random}`;
}
