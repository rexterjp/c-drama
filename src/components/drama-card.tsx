import Image from 'next/image';
import Link from 'next/link';
import type { Drama } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DramaCardProps = {
  drama: Drama;
};

export default function DramaCard({ drama }: DramaCardProps) {
  const poster = PlaceHolderImages.find(p => p.id === drama.posterId);

  return (
    <Link href={`/dramas/${drama.id}`} className="group block">
      <Card className="h-full overflow-hidden rounded-lg transition-all duration-180 ease-out shadow-sm hover:shadow-lg hover:-translate-y-1 bg-transparent">
        <CardContent className="p-0">
          {poster && (
            <Image
              src={poster.imageUrl}
              alt={`Poster for ${drama.title}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover rounded-md"
              data-ai-hint={poster.imageHint}
            />
          )}
        </CardContent>
        <CardHeader className="p-2">
          <CardTitle className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary">
            {drama.title}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
