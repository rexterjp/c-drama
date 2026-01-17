'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState, useEffect } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';

import type { Drama } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import DramaCard from '@/components/drama-card';
import InstagramIcon from '@/components/icons/instagram-icon';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function Hero() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 md:py-32 text-center">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
          Selamat Datang di C-Pop Now
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Platform ini adalah proyek pribadi oleh <span className="text-foreground font-semibold">Candra Pramudya Arunita</span>, dibuat untuk membagikan drama China terbaik kepada dunia.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="h-12 text-lg rounded-full bg-[#E4405F] hover:bg-[#E4405F]/90 text-white">
            <Link href="https://www.instagram.com/candra.pramudya.arunita" target="_blank" rel="noopener noreferrer">
              <InstagramIcon className="mr-2 h-5 w-5" />
              Instagram
            </Link>
          </Button>
          <Button asChild size="lg" className="h-12 text-lg rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white">
            <Link href="https://wa.me/6285646452979" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              WhatsApp
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrendingDramas() {
  const firestore = useFirestore();
  const trendingDramasQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'dramas'), where('isTrending', '==', true)) : null),
    [firestore]
  );
  const { data: trendingDramas, isLoading } = useCollection<Drama>(trendingDramasQuery);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Sedang Tren</h2>
          <div className="flex space-x-4 -ml-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                <Skeleton className="h-4 w-3/4 my-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Sedang Tren</h2>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {trendingDramas?.map((drama) => (
              <CarouselItem key={drama.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                <DramaCard drama={drama} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

function AllDramasGrid({ dramas }: { dramas: Drama[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {dramas.map((drama) => (
        <DramaCard key={drama.id} drama={drama} />
      ))}
    </div>
  );
}

function DramaGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="rounded-lg overflow-hidden bg-transparent shadow-sm">
          <CardContent className="p-0">
            <Skeleton className="w-full aspect-[2/3]" />
            <div className="p-2 pt-1">
              <Skeleton className="h-4 w-3/4 my-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function Home() {
  const firestore = useFirestore();
  const dramasQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'dramas') : null), [firestore]);
  const { data: allDramas, isLoading } = useCollection<Drama>(dramasQuery);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDramas = useMemo(() => {
    const dramas = allDramas || [];
    if (!searchQuery) {
      return dramas;
    }
    return dramas.filter((drama) =>
      drama.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allDramas, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredDramas.length / itemsPerPage);

  const paginatedDramas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDramas.slice(startIndex, endIndex);
  }, [filteredDramas, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <Hero />
      <TrendingDramas />

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Semua Drama</h2>
            <div className="relative w-full max-w-sm">
                <Input
                    type="search"
                    placeholder="Cari drama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-full shadow-sm bg-background"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
        </div>

        <Suspense fallback={<DramaGridSkeleton />}>
          {isLoading ? (
            <DramaGridSkeleton />
          ) : paginatedDramas.length > 0 ? (
            <AllDramasGrid dramas={paginatedDramas} />
          ) : (
            <div className="border-dashed border-2 rounded-lg p-8 text-center mt-4">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Tidak ada drama yang cocok dengan pencarian Anda.'
                  : 'Belum ada drama yang tersedia. Tambahkan data ke koleksi "dramas" Firestore Anda.'
                }
              </p>
            </div>
          )}
        </Suspense>

        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Sebelumnya
                </Button>
                <span className="text-muted-foreground font-medium">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Berikutnya
                </Button>
            </div>
        )}
      </section>
    </div>
  );
}
