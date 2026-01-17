'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

function NavLinks() {
  return (
    <nav className="flex flex-col gap-6 p-4 mt-8">
      <Link href="/" className="font-bold text-2xl hover:underline">Home</Link>
      <Link href="/request" className="font-bold text-2xl hover:underline">Request</Link>
    </nav>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto h-20 flex items-center justify-between px-4">
        <Link href="/" className="font-headline text-2xl md:text-3xl font-bold">
          C-Pop Now
        </Link>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l w-4/5">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-semibold hover:underline">Home</Link>
          <Link href="/request" className="font-semibold hover:underline">Request</Link>
        </nav>
      </div>
    </header>
  );
}
