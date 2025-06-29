'use client'

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { AuthKitProvider } from '@workos-inc/authkit-nextjs/components';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitProvider>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </AuthKitProvider>
  );
}
