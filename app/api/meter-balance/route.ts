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
      // For now, return a placeholder response since Polar meter API is not available in sandbox
      // In production, you would use the actual Polar API to fetch meter balance
      console.log('Meter balance requested for customer:', customerId);
      
      return NextResponse.json({
        balance: 500, // Default balance for new customers
        meterId: POLAR_SEARCH_METER_ID,
        customerId: customerId,
        note: 'Using default balance - meter API not available in sandbox'
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