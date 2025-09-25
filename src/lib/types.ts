import type { User } from '@clerk/nextjs/server';

export type AppUser = User & { plan: 'free' | 'premium' };

export interface UsageResponse {
  allowed: boolean;
  currentCount: number;
  maxFree: number;
  message: string;
}
