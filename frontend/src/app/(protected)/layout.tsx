'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { loadTokens } from '@/store/slices/authSlice';
import { Demo9Layout } from '@/app/components/layouts/demo9/layout';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    dispatch(loadTokens());
    setHydrated(true);
  }, [dispatch]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace('/signin');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return <Demo9Layout>{children}</Demo9Layout>;
}
