'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';

export default function Page() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      organization: '',
      email: 'demo@kt.com',
      password: 'demo123',
      rememberMe: false,
    },
  });

  async function onSubmit(values: SigninSchemaType) {
    setIsProcessing(true);
    setError(null);

    // TODO: Uncomment backend call when ready
    // try {
    //   const response = await signIn('credentials', {
    //     redirect: false,
    //     email: values.email,
    //     password: values.password,
    //     rememberMe: values.rememberMe,
    //   });
    //   if (response?.error) {
    //     const errorData = JSON.parse(response.error);
    //     setError(errorData.message);
    //   } else {
    //     router.push('/dashboard');
    //   }
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    // } finally {
    //   setIsProcessing(false);
    // }

    // Static mock signin — redirect to 2FA before setting credentials
    setTimeout(() => {
      setIsProcessing(false);
      router.push(`/2fa?email=${encodeURIComponent(values.email)}`);
    }, 800);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 pb-2">
          <Link href="/">
            <img
              src={toAbsoluteUrl('/logo.png')}
              className="h-[80px]"
              alt="Legal & Migration"
            />
          </Link>
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
            Legal &amp; Migration
          </p>
        </div>

        <div className="space-y-1 pb-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input placeholder="Enter organization name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center gap-2.5">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/reset-password"
                  className="text-sm font-semibold text-primary hover:text-primary/80"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  placeholder="Enter password"
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

        <div className="flex items-center space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm leading-none text-muted-foreground"
                >
                  Remember me
                </label>
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : null}
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
