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
      // For now, simulate usage reporting since meter API is not available in sandbox
      // In production, you would use the actual Polar API to report usage
      console.log('Usage reported for customer:', customerId, 'with data:', eventData);
      
      return NextResponse.json({
        success: true,
        eventId: `simulated-${Date.now()}`,
        note: 'Using simulated reporting - meter API not available in sandbox'
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