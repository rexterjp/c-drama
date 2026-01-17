'use client';

import Link from 'next/link';
import { Menu, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function NavLinks({ onLinkClick }: { onLinkClick?: () => void }) {
  return (
    <>
      <Link href="/" className="font-semibold text-lg md:text-base hover:underline" onClick={onLinkClick}>Beranda</Link>
      <Link href="/request" className="font-semibold text-lg md:text-base hover:underline" onClick={onLinkClick}>Permintaan</Link>
    </>
  );
}

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (email?: string | null) => {
    return email ? email.charAt(0).toUpperCase() : 'A';
  }

  const AuthNav = () => {
    if (isUserLoading) {
      return <Skeleton className="h-10 w-10 rounded-full" />;
    }
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL ?? ''} alt={user.email ?? ''} />
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/admin')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dasbor</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button asChild variant="ghost" className="hidden md:flex">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4"/>
          Masuk
        </Link>
      </Button>
    );
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto h-28 flex items-center justify-between px-4">
        <Link href="/">
          <Image
            src="https://i.ibb.co/wF450cnb/unnamed-2.png"
            alt="C-Pop Now Logo"
            width={160}
            height={40}
            priority
            className="h-24 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <AuthNav />
          </div>

          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-l w-4/5">
                <SheetHeader>
                   <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 p-4 mt-8">
                  <NavLinks onLinkClick={() => setIsSheetOpen(false)} />
                  <div className="border-t pt-6 mt-6">
                    {user ? (
                      <div className="space-y-4">
                        <Button asChild className="w-full" onClick={() => {router.push('/admin'); setIsSheetOpen(false);}}>
                           <Link href="/admin">Dasbor</Link>
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => {handleLogout(); setIsSheetOpen(false);}}>Keluar</Button>
                      </div>
                    ) : !isUserLoading ? (
                      <Button asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                        <Link href="/login">Masuk</Link>
                      </Button>
                    ) : null}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
