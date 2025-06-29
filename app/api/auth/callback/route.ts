import { NextRequest } from 'next/server';
import { handleAuth } from '@workos-inc/authkit-nextjs';

export const GET = handleAuth();
