# Polar Meter-Based Billing Setup

This guide walks through setting up usage-based billing with credits in Polar for the Pro subscription tier.

## Overview

- **Free Tier**: 10 searches per day (no meter tracking)
- **Pro Tier**: 500 search credits per month via Polar's meter-based billing

## Setup Steps

### 1. Create Usage Meter in Polar

1. Go to your Polar dashboard (sandbox or production)
2. Navigate to **Products** → **Meters**
3. Click **Create Meter** with these settings:
   - **Name**: `search_usage`
   - **Display Name**: Search Usage
   - **Event Key**: `search`
   - **Aggregation Type**: Count (each search = 1 unit)

4. Copy the Meter ID and add to `.env.local`:
   ```
   POLAR_SEARCH_METER_ID=<your-meter-id>
   ```

### 2. Update Product Configuration

1. In Polar dashboard, go to your Pro product
2. Edit the product and add a **Credits Benefit**:
   - **Type**: Credits
   - **Meter**: search_usage
   - **Amount**: 500
   - **Recurring**: Monthly (for subscriptions)

This will automatically grant 500 search credits at the start of each billing cycle.

### 3. Track Usage in Your Application

The application tracks usage in two ways:
- **Free users**: Daily limit tracked in Convex (`searchesUsedToday`)
- **Pro users**: Monthly credits tracked via Polar meters

When a Pro user performs a search:
1. The app reports usage to Polar's meter
2. Polar deducts from their credit balance
3. The app also tracks local usage for quick display

### 4. Monitor Customer Balance

To check a customer's remaining credits:

```typescript
// Get customer meters
const meters = await polar.customers.meters.list({
  customerId: user.polarCustomerId,
});

// Find search meter balance
const searchMeter = meters.items.find(m => m.meterId === POLAR_SEARCH_METER_ID);
const remainingCredits = searchMeter?.balance || 0;
```

### 5. Handle Credit Exhaustion

The app should:
1. Check credit balance before allowing searches
2. Show remaining credits in the UI
3. Prompt users to purchase additional credits or wait for renewal

## Environment Variables

Add these to your `.env.local`:

```
# Existing Polar config
POLAR_API_KEY=your_api_key
POLAR_PRO_PRICE_ID=your_product_price_id

# New meter config
POLAR_SEARCH_METER_ID=your_meter_id
```

## Testing

1. Create a test subscription
2. Verify 500 credits are granted
3. Perform searches and verify credits decrease
4. Check that credits reset on renewal

## Notes

- Credits are granted at the start of each billing period
- Unused credits do not roll over
- Users can purchase additional credit packs if needed
- The app should gracefully handle when credits run out