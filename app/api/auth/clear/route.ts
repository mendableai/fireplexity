import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ message: 'All auth cookies cleared' });
  
  // Clear ALL cookies that might interfere with WorkOS
  const cookiesToClear = [
    'x-workos-session',
    'wos-session',
    '__session',
    '__clerk_db_jwt',
    '__clerk_db_jwt_X9DTgmyd',
    '__clerk_db_jwt_2F6ruXmy',
    '__clerk_db_jwt_4IsO9HeA',
    '__clerk_db_jwt_nX2Qomuc',
    '__clerk_db_jwt_WwnViksu',
    '__clerk_db_jwt_kiO4uN5Z',
    'sb-supabase-auth-token',
    'sb-supabasekong-e4gwkcs48w80wc4os000oows-auth-token-code-verifier'
  ];
  
  cookiesToClear.forEach(cookieName => {
    response.cookies.set(cookieName, '', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
    });
  });
  
  return response;
}