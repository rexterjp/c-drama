'use client';

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { Drama, Part } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';

export default function DramaDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const firestore = useFirestore();

  const dramaRef = useMemoFirebase(() => (firestore && id ? doc(firestore, 'dramas', id) : null), [firestore, id]);
  const { data: drama, isLoading: isDramaLoading, error: dramaError } = useDoc<Drama>(dramaRef);

  const partsQuery = useMemoFirebase(
    () => (firestore && id ? query(collection(firestore, 'parts'), where('dramaId', '==', id)) : null),
    [firestore, id]
  );
  const { data: parts, isLoading: arePartsLoading } = useCollection<Part>(partsQuery);

  // Correctly handle loading state
  const isLoading = !id || isDramaLoading || arePartsLoading || (id && !drama && !dramaError);

  const getEmbedUrl = (url: string) => {
    if (typeof url !== 'string') {
      return '';
    }
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (url.includes('drive.google.com') && fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
    return url;
  };
  
  const getCorrectedUrl = (url: string) => {
    if (typeof url === 'string' && url.includes('i.ibb.co.com')) {
      return url.replace('i.ibb.co.com', 'i.ibb.co');
    }
    return url;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Skeleton className="w-full aspect-[2/3] rounded-lg" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-12 w-3/4 mb-8" />
            <Skeleton className="h-10 w-1/4 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!drama) {
    notFound();
  }
  
  const posterUrl = drama.posterUrl ? getCorrectedUrl(drama.posterUrl) : undefined;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-1">
          {posterUrl && (
            <div className="rounded-lg overflow-hidden shadow-lg">
              <Image
                src={posterUrl}
                alt={`Poster untuk ${drama.title}`}
                width={400}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8">{drama.title}</h1>

          <div>
            <h2 className="font-headline text-3xl font-bold mb-4">Part</h2>
            {parts && parts.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {parts
                  .sort((a, b) => a.partNumber - b.partNumber)
                  .map((part) => (
                    <AccordionItem value={part.id} key={part.id}>
                      <AccordionTrigger className="text-base">
                        {`Part ${part.partNumber}: ${part.title}`}
                        <span className="font-normal text-muted-foreground ml-auto mr-4 text-sm">{part.duration}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        {part.videoUrl && (
                          <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg mb-4 relative">
                            <iframe
                              src={getEmbedUrl(part.videoUrl)}
                              allowFullScreen
                              className="h-full w-full border-0"
                            ></iframe>
                            <div className="absolute top-0 right-0 h-14 w-16 z-10"></div>
                          </div>
                        )}
                        <p className="text-muted-foreground">{part.description}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            ) : (
              <div className="border-dashed border-2 rounded-lg p-8 text-center">
                <p className="text-muted-foreground">Belum ada part yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
