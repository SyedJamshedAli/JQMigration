'use client';

import { Suspense, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { CheckCircle } from 'lucide-react';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toAbsoluteUrl } from '@/lib/helpers';

function TwoFAContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || 'demo@kt.com';

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [isProcessing, setIsProcessing] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timer, setTimer] = useState(37);
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
    setIsProcessing(false);
    setVerified(true);
    setTimeout(() => {
      dispatch(
        setCredentials({
          accessToken: 'mock-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            email,
            name: 'Demo User',
            avatar: null,
            status: 'active',
            roleId: '1',
            roleName: 'admin',
          },
        }),
      );
      router.push('/dashboard');
    }, 2000);
  }

  if (verified) {
    return (
      <div className="flex flex-col items-center gap-5 w-full py-4 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
          <CheckCircle className="size-10 text-green-600 dark:text-green-400" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Verified Successfully!</h3>
          <p className="text-sm text-muted-foreground">Welcome to Dashboard</p>
          <p className="text-xs text-muted-foreground">Redirecting you now...</p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-5 w-full"
    >
      <img
        alt=""
        className="dark:hidden h-20 mb-2"
        src={toAbsoluteUrl('/media/illustrations/34.svg')}
      />
      <img
        alt=""
        className="hidden dark:block h-20 mb-2"
        src={toAbsoluteUrl('/media/illustrations/34-dark.svg')}
      />

      <div className="text-center mb-2">
        <h3 className="text-lg font-medium mb-5">Verify your email</h3>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground mb-1.5">
            Enter the verification code we sent to your email
          </span>
          <span className="text-sm font-medium">{email}</span>
        </div>
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

      <div className="flex items-center justify-center mb-2">
        <span className="text-sm text-muted-foreground me-1.5">
          Didn&apos;t receive a code? ({timer}s)
        </span>
        <Link href="/signin" className="text-sm font-medium text-foreground hover:text-primary">
          Resend
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={code.join('').length < 6 || isProcessing}
      >
        Continue
      </Button>
    </form>
  );
}

export default function Page() {
  return (
    <Suspense>
      <TwoFAContent />
    </Suspense>
  );
}
