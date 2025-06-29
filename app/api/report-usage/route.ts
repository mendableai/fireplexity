import { NextRequest, NextResponse } from 'next/server';
import { polar, POLAR_SEARCH_METER_ID } from '@/lib/polar';
import { withAuth } from '@workos-inc/authkit-nextjs';

export async function POST(request: NextRequest) {
  try {
    const { user } = await withAuth();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId, eventData = {} } = await request.json();
    
    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    if (!POLAR_SEARCH_METER_ID) {
      console.log('Meter not configured, skipping usage reporting');
      return NextResponse.json({ 
        success: true,
        message: 'Meter not configured' 
      });
    }

    try {
      // Report usage event to Polar
      const event = await polar.usageEvents.create({
        customerId: customerId,
        meterId: POLAR_SEARCH_METER_ID,
        eventName: 'search',
        eventTimestamp: new Date().toISOString(),
        eventIdempotencyKey: `search-${user.id}-${Date.now()}`,
        eventProperties: {
          userId: user.id,
          ...eventData
        }
      });

      return NextResponse.json({
        success: true,
        eventId: event.id,
      });
    } catch (polarError: any) {
      console.error('Polar usage reporting error:', polarError);
      
      // Don't fail the search if usage reporting fails
      return NextResponse.json({
        success: false,
        error: 'Failed to report usage',
        message: polarError.message
      });
    }
  } catch (error) {
    console.error('Usage reporting error:', error);
    return NextResponse.json(
      { error: 'Failed to report usage' },
      { status: 500 }
    );
  }
}