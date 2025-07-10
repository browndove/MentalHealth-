'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { AppLogo } from '@/components/layout/AppLogo';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background p-4">
      <div className="absolute top-6 left-6">
        <AppLogo />
      </div>
      <LoginForm />
    </div>
  );
}
