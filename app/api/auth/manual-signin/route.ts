import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.WORKOS_CLIENT_ID;
  const redirectUri = process.env.WORKOS_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
  
  if (!clientId) {
    return NextResponse.json({ error: 'WORKOS_CLIENT_ID not configured' }, { status: 500 });
  }
  
  // Build the WorkOS authorization URL manually
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    provider: 'authkit',
    screen_hint: 'sign-in',
    state: Buffer.from(JSON.stringify({ returnPathname: '/' })).toString('base64')
  });
  
  const authUrl = `https://api.workos.com/user_management/authorize?${params.toString()}`;
  
  console.log('Manual signin redirect:', authUrl);
  
  return NextResponse.redirect(authUrl);
}