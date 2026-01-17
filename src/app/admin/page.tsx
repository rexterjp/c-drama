'use client';

import AuthGuard from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

function AdminDashboard() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>
      <div className="border-dashed border-2 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. CRUD functionality for dramas, genres, and episodes will be implemented here.
        </p>
      </div>
    </div>
  );
}


export default function AdminPage() {
    return (
        <AuthGuard>
            <AdminDashboard />
        </AuthGuard>
    )
}
