import { Polar } from '@polar-sh/sdk';

export const polar = new Polar({
  accessToken: process.env.POLAR_API_KEY || '',
  server: 'sandbox', // Use sandbox environment
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
    searches_per_month: 500, // 500 searches per month via credits
    features: ['500 searches per month', 'Advanced AI responses', 'Source citations', 'Search history', 'Priority support'],
  },
} as const;

// Polar meter ID for search usage tracking
export const POLAR_SEARCH_METER_ID = process.env.POLAR_SEARCH_METER_ID || '';
