'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Drama } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DramaCardProps = {
  drama: Drama;
};

export default function DramaCard({ drama }: DramaCardProps) {
  if (!drama?.id) return null;

  return (
    <Link href={`/dramas/${drama.id}`} className="group block cursor-pointer">
      <Card className="h-full overflow-hidden rounded-lg transition-all duration-180 ease-out shadow-sm hover:shadow-lg hover:-translate-y-1 bg-transparent">
        <CardContent className="p-0 relative aspect-[2/3]">
          {drama.posterUrl && (
            <Image
              src={drama.posterUrl}
              alt={`Poster for ${drama.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
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
