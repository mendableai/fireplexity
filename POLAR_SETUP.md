# Polar Setup Guide

## Steps to set up Polar for Fireplexity

1. **Create a Polar account** at https://polar.sh

2. **Create an organization** if you haven't already

3. **Create a Product**:
   - Go to Products → Create Product
   - Name: "Fireplexity Pro" (or your preferred name)
   - Description: "Unlimited AI-powered searches"
   - Price: $9.99 (or your preferred price)
   - Billing: Monthly recurring
   - Click "Create Product"

4. **Get your Product ID**:
   - After creating, click on the product
   - Copy the Product ID (UUID format)

5. **Get your API Key**:
   - Go to Settings → API Keys
   - Create a new API key with "write" permissions
   - Copy the API key (starts with `polar_oat_`)

6. **Update `.env.local`**:
   ```
   POLAR_API_KEY=your_polar_api_key_here
   POLAR_PRO_PRICE_ID=your_product_id_here
   ```

7. **Test the integration**:
   - Restart your Next.js server
   - Try the upgrade button in the dashboard

## Troubleshooting

- Make sure your API key has write permissions
- Ensure the Product ID matches a product in your organization
- Check that your product is active and not archived
- Verify you're using the correct environment (production vs sandbox)