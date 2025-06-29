import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@workos-inc/authkit-nextjs';
import { polar } from '@/lib/polar';

export async function POST(request: NextRequest) {
  try {
    const { user } = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier } = await request.json();
    
    if (tier !== 'pro') {
      return NextResponse.json({ error: 'Invalid subscription tier' }, { status: 400 });
    }

    const checkoutSession = await polar.checkouts.create({
      productPriceId: process.env.POLAR_PRO_PRICE_ID!,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      customerEmail: user.email,
      metadata: {
        workosUserId: user.id,
        tier: 'pro',
      },
    });

    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
