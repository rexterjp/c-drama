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
      <Card className="h-full border-2 border-black shadow-hard-lg group-hover:shadow-hard transition-all duration-150 ease-in-out">
        <CardContent className="p-0">
          {poster && (
            <Image
              src={poster.imageUrl}
              alt={`Poster for ${drama.title}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover"
              data-ai-hint={poster.imageHint}
            />
          )}
        </CardContent>
        <CardHeader className="p-3">
          <CardTitle className="text-base font-bold truncate group-hover:underline">
            {drama.title}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
