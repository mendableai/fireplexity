import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Polar webhook received:', body);

    switch (body.type) {
      case 'subscription.created':
      case 'subscription.updated':
        const subscriptionData = body.data;
        
        if (subscriptionData.customer_id && subscriptionData.product_id === '722b9fc1-64aa-4993-a612-ac7417600c70') {
          console.log(`Processing subscription for customer: ${subscriptionData.customer_id}`);
        }
        break;
        
      case 'subscription.canceled':
        const canceledData = body.data;
        
        if (canceledData.customer_id) {
          console.log(`Processing cancellation for customer: ${canceledData.customer_id}`);
        }
        break;
        
      default:
        console.log(`Unhandled webhook type: ${body.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
