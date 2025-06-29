'use client';

export function SignInButton() {
  return (
    <a href="/api/auth/signin" className="btn btn-primary">
      Sign In
    </a>
  );
}

export function SignOutButton() {
  return (
    <a href="/api/auth/signout" className="btn btn-secondary">
      Sign Out
    </a>
  );
}