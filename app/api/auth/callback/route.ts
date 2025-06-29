import { NextRequest, NextResponse } from 'next/server';
import { handleAuth } from '@workos-inc/authkit-nextjs';

const authHandler = handleAuth();

export async function GET(request: NextRequest) {
  console.log('=== AUTH CALLBACK ===');
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');
  
  console.log('Callback params:', { 
    hasCode: !!code,
    codeLength: code?.length,
    state: state ? JSON.parse(Buffer.from(state, 'base64').toString()) : null,
    error 
  });
  
  try {
    const response = await authHandler(request);
    console.log('Auth handler response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      hasSetCookie: response.headers.has('set-cookie')
    });
    
    // If successful, it should redirect
    if (response.status === 302 || response.status === 307) {
      console.log('Redirect location:', response.headers.get('location'));
    }
    
    return response;
  } catch (error) {
    console.error('=== CALLBACK ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : undefined);
    
    // Return a more detailed error page
    return new NextResponse(
      `<html>
        <body>
          <h1>Authentication Error</h1>
          <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
          <pre>${JSON.stringify({ code: !!code, state: !!state, error }, null, 2)}</pre>
          <a href="/api/auth/signin">Try again</a>
        </body>
      </html>`,
      { 
        status: 500,
        headers: { 'content-type': 'text/html' }
      }
    );
  }
}