'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';

import type { Drama } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import DramaCard from '@/components/drama-card';
import InstagramIcon from '@/components/icons/instagram-icon';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';

const AllDramas = dynamic(() => import('@/components/all-dramas'), {
  loading: () => <DramaGridSkeleton />,
});

function Hero() {
  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16 md:py-32 text-center">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground leading-tight mb-4">
          Selamat Datang di C-Drama
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Platform ini adalah proyek pribadi oleh <span className="text-foreground font-semibold">Candra Pramudya Arunita</span>, dibuat untuk membagikan drama pendek trending kepada Anda.
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
            {trendingDramas?.map((drama, index) => (
              <CarouselItem key={drama.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                <DramaCard drama={drama} priority={index < 2} />
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

function DramaGridSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-12 w-1/3 max-w-sm" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
            ))}
        </div>
    </div>
  )
}


export default function Home() {
  return (
    <div>
      <Hero />
      <TrendingDramas />
      <AllDramas />
    </div>
  );
}
