import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDramaById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import StarIcon from '@/components/icons/star-icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

type DramaDetailPageProps = {
  params: {
    id: string;
  };
};

export default function DramaDetailPage({ params }: DramaDetailPageProps) {
  const drama = getDramaById(params.id);

  if (!drama) {
    notFound();
  }

  const poster = PlaceHolderImages.find(p => p.id === drama.posterId);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          {poster && (
            <div className="border-2 border-black shadow-hard-lg">
              <Image
                src={poster.imageUrl}
                alt={`Poster for ${drama.title}`}
                width={400}
                height={600}
                className="w-full h-auto"
                priority
                data-ai-hint={poster.imageHint}
              />
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            {drama.genre.map((g) => (
              <Badge key={g} variant="outline" className="border-2 border-black text-sm">{g}</Badge>
            ))}
          </div>
          <h1 className="font-headline text-4xl md:text-6xl uppercase font-bold mb-4">{drama.title}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`w-8 h-8 ${i < drama.rating ? 'text-secondary' : 'text-muted'}`} />
              ))}
            </div>
            <p className="font-bold text-2xl">{drama.rating.toFixed(1)}</p>
          </div>

          <Collapsible className="mb-8">
            <p className="text-lg leading-relaxed">
              {drama.synopsis.substring(0, 150)}
              <CollapsibleTrigger asChild>
                <Button variant="link" className="p-1 text-lg font-bold">
                  ...Read More
                  <ChevronDown className="h-4 w-4 ml-1"/>
                </Button>
              </CollapsibleTrigger>
            </p>
            <CollapsibleContent>
              <p className="text-lg leading-relaxed mt-2">
                {drama.synopsis.substring(150)}
              </p>
            </CollapsibleContent>
          </Collapsible>

          <div className="mb-8">
            <h2 className="font-headline text-3xl uppercase mb-4">Episodes</h2>
            {drama.episodes.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {drama.episodes.map((episode) => (
                <AccordionItem value={episode.id} key={episode.id}>
                  <AccordionTrigger>
                    {episode.title}
                    <span className="font-normal text-muted-foreground ml-auto mr-4 text-sm">{episode.duration}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>{episode.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            ) : (
                <p className="text-muted-foreground border-2 border-dashed border-black p-8 text-center">No episodes available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
