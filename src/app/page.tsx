import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { getDramas, getTrendingDramas, getGenres, getDramaById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import StarIcon from '@/components/icons/star-icon';
import DramaCard from '@/components/drama-card';
import GenreFilters from '@/components/genre-filters';

function Hero() {
  const heroDrama = getDramaById('1');
  if (!heroDrama) return null;

  const heroImage = PlaceHolderImages.find(img => img.id === heroDrama.posterId);

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] bg-black border-b-4 border-black">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroDrama.title}
          fill
          className="object-cover opacity-50"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 lg:p-12">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="border-2 border-black bg-secondary text-secondary-foreground text-sm font-bold shadow-hard">HOT</Badge>
          <Badge className="border-2 border-black bg-primary text-primary-foreground text-sm font-bold shadow-hard">TRENDING</Badge>
        </div>
        <h1 className="font-headline text-4xl md:text-6xl lg:text-8xl uppercase text-white font-bold drop-shadow-[2px_2px_0_#000]">
          {heroDrama.title}
        </h1>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className={`w-6 h-6 md:w-8 md:h-8 ${i < heroDrama.rating ? 'text-secondary' : 'text-white/50'}`} />
            ))}
          </div>
          <p className="text-white font-bold text-lg md:text-xl">{heroDrama.rating.toFixed(1)}</p>
        </div>
        <div className="mt-6">
          <Button asChild size="lg" className="h-14 text-lg border-2 border-black shadow-hard hover:shadow-none transition-shadow">
            <Link href={`/dramas/${heroDrama.id}`}>Watch Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function TrendingDramas() {
  const trendingDramas = getTrendingDramas();

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-headline text-3xl md:text-4xl uppercase mb-6">Trending Now</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {trendingDramas.map((drama) => (
              <CarouselItem key={drama.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                <DramaCard drama={drama} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-16 border-2 border-black bg-white hover:bg-secondary shadow-hard-sm" />
          <CarouselNext className="mr-16 border-2 border-black bg-white hover:bg-secondary shadow-hard-sm" />
        </Carousel>
      </div>
    </section>
  );
}

function AllDramasGrid() {
  const dramas = getDramas();
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
        <Card key={i} className="border-2 border-black shadow-hard-lg">
          <CardContent className="p-0">
            <Skeleton className="w-full aspect-[2/3] bg-muted" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


export default function Home() {
  const genres = getGenres();

  return (
    <div className="bg-background">
      <Hero />
      <TrendingDramas />

      <section className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="font-headline text-3xl md:text-4xl uppercase mb-6">All Dramas</h2>
        <GenreFilters genres={genres} />
        <Suspense fallback={<DramaGridSkeleton />}>
          <AllDramasGrid />
        </Suspense>
      </section>
    </div>
  );
}
