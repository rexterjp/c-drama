'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto p-4 py-12">
        <div className="space-y-4 max-w-2xl">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
