'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { AppLogo } from '@/components/layout/AppLogo';

export default function LoginPage() {
  console.log('LoginPage component rendering started (client-side)'); // Diagnostic log
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="absolute top-6 left-6">
        <AppLogo />
      </div>
      <LoginForm />
    </div>
  );
}
