'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getGenres } from '@/lib/data';

function NavLinks() {
  const genres = getGenres();
  return (
    <nav className="flex flex-col gap-4 p-4">
      <Link href="/" className="font-bold hover:underline">Home</Link>
      <h3 className="font-semibold text-lg">Genres</h3>
      {genres.map(genre => (
        <Link key={genre} href={`/genre/${genre.toLowerCase()}`} className="text-muted-foreground hover:text-foreground hover:underline">
          {genre}
        </Link>
      ))}
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
              <NavLinks />
            </SheetContent>
          </Sheet>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-semibold hover:underline">Home</Link>
          <Link href="/dramas" className="font-semibold hover:underline">All Dramas</Link>
        </nav>
      </div>
    </header>
  );
}
