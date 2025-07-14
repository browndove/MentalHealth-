import { RegisterForm } from '@/components/auth/RegisterForm';
import { AppLogo } from '@/components/layout/AppLogo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-secondary/50 to-background p-4 py-8">
      <div className="absolute top-6 left-6">
         <AppLogo />
      </div>
      <RegisterForm />
    </div>
  );
}
