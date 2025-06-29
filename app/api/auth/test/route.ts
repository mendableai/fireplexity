import { NextRequest, NextResponse } from 'next/server';
import { getSignInUrl, getSignUpUrl } from '@workos-inc/authkit-nextjs';

export async function GET(request: NextRequest) {
  try {
    // Test if we can generate URLs
    const signInUrl = await getSignInUrl();
    const signUpUrl = await getSignUpUrl();
    
    return NextResponse.json({
      success: true,
      environment: {
        WORKOS_API_KEY: process.env.WORKOS_API_KEY ? 'Set' : 'Missing',
        WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID || 'Missing',
        WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI || 'Missing',
        WORKOS_COOKIE_PASSWORD: process.env.WORKOS_COOKIE_PASSWORD ? 'Set' : 'Missing',
      },
      urls: {
        signIn: signInUrl,
        signUp: signUpUrl,
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}