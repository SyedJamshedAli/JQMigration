'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowRight, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(values: FormValues) {
    setIsProcessing(true);
    setError(null);

    // TODO: Call backend API when ready
    await new Promise((r) => setTimeout(r, 800));
    setIsProcessing(false);
    router.push(`/check-email?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        <div className="text-center space-y-1.5 pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Your Email</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to reset password
          </p>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@email.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isProcessing} className="w-full gap-2">
          {isProcessing ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : null}
          Continue
          {!isProcessing && <ArrowRight className="size-4" />}
        </Button>
      </form>
    </Form>
  );
}
