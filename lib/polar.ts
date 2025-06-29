import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
  accessToken: process.env.POLAR_API_KEY || '',
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});

export const SUBSCRIPTION_TIERS = {
  FREE: {
    name: 'Free',
    price: 0,
    searches_per_day: 10,
    features: ['10 searches per day', 'Basic AI responses', 'Source citations'],
  },
  PRO: {
    name: 'Pro',
    price: 9.99,
    searches_per_day: -1, // unlimited
    features: ['Unlimited searches', 'Advanced AI responses', 'Source citations', 'Search history', 'Priority support'],
  },
} as const;
