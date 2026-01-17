'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type GenreFiltersProps = {
  genres: string[];
};

export default function GenreFilters({ genres }: GenreFiltersProps) {
  const [activeGenre, setActiveGenre] = useState('All');

  const allGenres = ['All', ...genres];

  return (
    <div className="mb-8">
      <div className="flex space-x-2 overflow-x-auto pb-4 -mx-4 px-4">
        {allGenres.map((genre) => (
          <Button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            variant="outline"
            size="lg"
            className={cn(
              'h-12 min-w-24 whitespace-nowrap border-2 border-black shadow-hard-sm text-base font-bold hover:bg-secondary focus:bg-secondary',
              activeGenre === genre
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-background'
            )}
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
}
