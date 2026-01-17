import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { getDramas, getTrendingDramas, getGenres, getDramaById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import StarIcon from '@/components/icons/star-icon';
import DramaCard from '@/components/drama-card';
import GenreFilters from '@/components/genre-filters';
import { ArrowRight } from 'lucide-react';

function Hero() {
  const heroDrama = getDramaById('1');
  if (!heroDrama) return null;

  const heroImage = PlaceHolderImages.find(img => img.id === heroDrama.posterId);

  return (
    <section className="w-full">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="md:order-last">
            {heroImage && (
                <Image
                src={heroImage.imageUrl}
                alt={heroDrama.title}
                width={600}
                height={900}
                className="object-cover rounded-lg shadow-lg w-full h-auto"
                priority
                data-ai-hint={heroImage.imageHint}
                />
            )}
            </div>
            <div>
                <h1 className="font-headline text-4xl md:text-6xl font-bold text-foreground leading-tight">
                    {heroDrama.title}
                </h1>
                <div className="flex items-center gap-4 my-6">
                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} className={`w-6 h-6 ${i < heroDrama.rating ? 'text-secondary' : 'text-muted-foreground/50'}`} />
                        ))}
                    </div>
                    <p className="text-foreground font-bold text-lg">{heroDrama.rating.toFixed(1)}</p>
                </div>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-prose">
                    {heroDrama.synopsis}
                </p>
                
                <Button asChild size="lg" className="h-12 text-lg rounded-full">
                    <Link href={`/dramas/${heroDrama.id}`}>
                        Watch Now
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
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
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">Trending Now</h2>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {trendingDramas.map((drama) => (
              <CarouselItem key={drama.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5 pl-4">
                <DramaCard drama={drama} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
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
  const genres = getGenres();

  return (
    <div>
      <Hero />
      <TrendingDramas />

      <section className="container mx-auto px-4 py-8 md:py-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-6">All Dramas</h2>
        <GenreFilters genres={genres} />
        <Suspense fallback={<DramaGridSkeleton />}>
          <AllDramasGrid />
        </Suspense>
      </section>
    </div>
  );
}
