import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getDramaById } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import StarIcon from '@/components/icons/star-icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
            <div className="rounded-lg overflow-hidden shadow-lg">
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
              <Badge key={g} variant="secondary" className="text-sm">{g}</Badge>
            ))}
          </div>
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">{drama.title}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`w-7 h-7 ${i < drama.rating ? 'text-secondary' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
            <p className="font-bold text-xl">{drama.rating.toFixed(1)}</p>
          </div>

          <p className="text-lg leading-relaxed text-muted-foreground mb-8">
            {drama.synopsis}
          </p>

          <div className="mb-8">
            <h2 className="font-headline text-3xl font-bold mb-4">Episodes</h2>
            {drama.episodes.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {drama.episodes.map((episode) => (
                <AccordionItem value={episode.id} key={episode.id}>
                  <AccordionTrigger className="text-base">
                    {episode.title}
                    <span className="font-normal text-muted-foreground ml-auto mr-4 text-sm">{episode.duration}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    {drama.id === '1' && episode.id === '101' && (
                      <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg mb-4">
                        <iframe
                          src="https://drive.google.com/file/d/19bdwYFqqd7vzYFSI_Qc5qASVVSbr-nD5/preview"
                          allowFullScreen
                          className="h-full w-full border-0"
                        ></iframe>
                      </div>
                    )}
                    <p className="text-muted-foreground">{episode.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            ) : (
                <div className="border-dashed border-2 rounded-lg p-8 text-center">
                    <p className="text-muted-foreground">No episodes available yet.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
