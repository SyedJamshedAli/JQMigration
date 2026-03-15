'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  ChangePasswordSchemaType,
  getChangePasswordSchema,
} from '../forms/change-password-schema';

function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || null;

  const [verifyingToken, setVerifyingToken] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(getChangePasswordSchema()),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // TODO: Verify token with backend when ready
    // const verifyToken = async () => { ... }
    if (token) {
      setVerifyingToken(false);
      setIsValidToken(true); // Mock: accept any token
    } else {
      setError('No reset token provided.');
    }
  }, [token]);

  async function onSubmit(_values: ChangePasswordSchemaType) {
    setIsProcessing(true);
    setError(null);

    // TODO: Uncomment backend call when ready
    // try {
    //   const response = await apiFetch('/api/auth/reset-password', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ token, newPassword: _values.newPassword }),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     setError(errorData.message || 'Failed to change password.');
    //   } else {
    //     setSuccessMessage('Password changed successfully.');
    //   }
    // } catch {
    //   setError('An unexpected error occurred.');
    // } finally {
    //   setIsProcessing(false);
    // }

    // Mock: simulate success
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMessage('Password changed successfully.');
    }, 800);
  }

  if (verifyingToken) {
    return (
      <div className="flex justify-center py-4">
        <LoaderCircleIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (successMessage) {
    return (
      <Alert>
        <AlertIcon>
          <Check />
        </AlertIcon>
        <AlertTitle>
          {successMessage}{' '}
          <Link href="/signin" className="text-primary hover:text-primary-darker">
            Sign in
          </Link>
          .
        </AlertTitle>
      </Alert>
    );
  }

  if (!isValidToken) {
    return (
      <Alert variant="destructive">
        <AlertIcon>
          <AlertCircle />
        </AlertIcon>
        <AlertTitle>{error}</AlertTitle>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full space-y-5">
        <div className="space-y-1.5 pb-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Enter your new password</p>
        </div>

        {error && (
          <Alert variant="destructive" onClose={() => setError(null)}>
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <div className="relative">
                <Input
                  placeholder="New password"
                  type={passwordVisible ? 'text' : 'password'}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                >
                  {passwordVisible ? (
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <div className="relative">
                <Input
                  placeholder="Confirm new password"
                  type={passwordConfirmationVisible ? 'text' : 'password'}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() =>
                    setPasswordConfirmationVisible(!passwordConfirmationVisible)
                  }
                  className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                  aria-label={
                    passwordConfirmationVisible
                      ? 'Hide password confirmation'
                      : 'Show password confirmation'
                  }
                >
                  {passwordConfirmationVisible ? (
                    <EyeOff className="text-muted-foreground" />
                  ) : (
                    <Eye className="text-muted-foreground" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2.5">
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : null}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function Page() {
  return (
    <Suspense>
      <ChangePasswordForm />
    </Suspense>
  );
}
