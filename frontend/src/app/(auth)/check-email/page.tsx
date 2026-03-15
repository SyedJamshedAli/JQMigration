'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CheckEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || 'your email';

  return (
    <div className="flex flex-col items-center text-center space-y-5 py-2">
      {/* Illustration */}
      <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
        <Mail className="size-12 text-primary" strokeWidth={1.5} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Please click the link sent to your email{' '}
          <span className="font-medium text-foreground">{email}</span>{' '}
          to reset your password. Thank you
        </p>
      </div>

      <Button asChild className="w-full max-w-[200px]">
        <Link href="/change-password?token=mock">Skip for now</Link>
      </Button>

      <p className="text-sm text-muted-foreground">
        Didn&apos;t receive an email?{' '}
        <Link
          href="/reset-password"
          className="font-semibold text-foreground hover:text-primary"
        >
          Resend
        </Link>
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  );
}
