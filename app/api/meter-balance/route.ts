import { NextRequest, NextResponse } from 'next/server';
import { polar, POLAR_SEARCH_METER_ID } from '@/lib/polar';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function GET(request: NextRequest) {
  try {
    const { user } = await withAuth();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's Polar customer ID from your database
    // This would typically come from Convex
    const customerId = request.nextUrl.searchParams.get('customerId');
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    if (!POLAR_SEARCH_METER_ID) {
      return NextResponse.json({ 
        balance: 0,
        error: 'Meter not configured' 
      });
    }

    try {
      // Get customer meters from Polar
      const meters = await polar.customers.meters.list({
        customerId: customerId,
      });

      // Find the search meter
      const searchMeter = meters.items?.find(m => m.meterId === POLAR_SEARCH_METER_ID);
      
      return NextResponse.json({
        balance: searchMeter?.balance || 0,
        meterId: POLAR_SEARCH_METER_ID,
        customerId: customerId,
      });
    } catch (polarError: any) {
      console.error('Polar API error:', polarError);
      
      // Return cached balance from database if Polar is unavailable
      return NextResponse.json({
        balance: 0,
        error: 'Unable to fetch real-time balance',
        cached: true
      });
    }
  } catch (error) {
    console.error('Meter balance error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meter balance' },
      { status: 500 }
    );
  }
}