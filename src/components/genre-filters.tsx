'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type GenreFiltersProps = {
  genres: string[];
};

export default function GenreFilters({ genres }: GenreFiltersProps) {
  const [activeGenre, setActiveGenre] = useState('All');
  const mainGenres = ['All', ...genres.slice(0, 3)];
  const moreGenres = genres.slice(3);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        {mainGenres.map((genre) => (
          <Button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            variant={activeGenre === genre ? "default" : "outline"}
            size="sm"
            className={cn(
              'rounded-full h-9 shadow-sm',
              activeGenre !== genre && 'bg-background'
            )}
          >
            {genre}
          </Button>
        ))}
        {moreGenres.length > 0 && (
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-full h-9 shadow-sm bg-background">
                More
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {moreGenres.map((genre) => (
                <DropdownMenuItem key={genre} onSelect={() => setActiveGenre(genre)}>
                  {genre}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
