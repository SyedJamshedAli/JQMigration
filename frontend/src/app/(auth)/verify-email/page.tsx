'use client';

import { Suspense, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { Mail } from 'lucide-react';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function VerifyEmailContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || 'your email';
  const name = searchParams?.get('name') || 'Demo User';

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isProcessing, setIsProcessing] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length < 6) return;

    setIsProcessing(true);

    // Mock: accept any 6-digit code
    await new Promise((r) => setTimeout(r, 800));

    dispatch(
      setCredentials({
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email,
          name,
          avatar: null,
          status: 'active',
          roleId: '1',
          roleName: 'admin',
        },
      }),
    );
    router.push('/dashboard');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full">
      {/* Icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
        <Mail className="size-10 text-primary" strokeWidth={1.5} />
      </div>

      <div className="text-center space-y-1.5 mb-2">
        <h3 className="text-xl font-semibold">Verify your email</h3>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to
        </p>
        <p className="text-sm font-medium">{email}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2.5">
        {code.map((digit, i) => (
          <Input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="size-10 shrink-0 px-0 text-center focus:border-primary/10 focus:ring-3 focus:ring-primary/10"
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <span className="text-sm text-muted-foreground">Didn&apos;t receive a code?</span>
        <Link href="#" className="text-sm font-medium text-foreground hover:text-primary">
          Resend
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={code.join('').length < 6 || isProcessing}
      >
        {isProcessing ? 'Verifying...' : 'Verify Email'}
      </Button>

      <Link href="/signin" className="text-sm text-muted-foreground hover:text-primary">
        Back to Sign In
      </Link>
    </form>
  );
}

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}