import { NextRequest, NextResponse } from 'next/server';
import { polar } from '@/lib/polar';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await request.json();
    
    if (tier !== 'pro') {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    // Check if Polar is properly configured
    if (!process.env.POLAR_API_KEY || !process.env.POLAR_PRO_PRICE_ID) {
      console.log('Polar not configured properly. Please follow POLAR_SETUP.md');
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 503 }
      );
    }

    console.log('Creating checkout with:', {
      priceId: process.env.POLAR_PRO_PRICE_ID,
      email: user.email,
      userId: user.id,
    });

    const checkoutSession = await polar.checkouts.create({
      products: [process.env.POLAR_PRO_PRICE_ID!],
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?checkout=success`,
      customerEmail: user.email,
      metadata: {
        workosUserId: user.id,
        tier: 'pro',
      },
    });

    console.log('Checkout session created:', checkoutSession);

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Please try again later.' },
      { status: 500 }
    );
  }
}
