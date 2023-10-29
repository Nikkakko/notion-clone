import * as React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}
function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div>
      <h1>Auth Layout</h1>
      {children}
    </div>
  );
}

export default AuthLayout;
