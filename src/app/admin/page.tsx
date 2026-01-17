'use client';

import AuthGuard from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import DramasCrud from './dramas-crud';
import PartsCrud from './parts-crud';

function AdminDashboard() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-4xl font-bold">Dasbor Admin</h1>
        <Button onClick={handleLogout} variant="outline">Keluar</Button>
      </div>
      
      <Tabs defaultValue="dramas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dramas">Drama</TabsTrigger>
          <TabsTrigger value="parts">Part</TabsTrigger>
        </TabsList>
        <TabsContent value="dramas" className="mt-6">
          <DramasCrud />
        </TabsContent>
        <TabsContent value="parts" className="mt-6">
          <PartsCrud />
        </TabsContent>
      </Tabs>
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
