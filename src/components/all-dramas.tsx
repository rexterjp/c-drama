'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import { collection } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';

import type { Drama } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DramaCard from '@/components/drama-card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

function AllDramasGrid({ dramas }: { dramas: Drama[] }) {
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

export default function AllDramas() {
  const firestore = useFirestore();
  const dramasQuery = useMemoFirebase(() => (firestore ? collection(firestore, 'dramas') : null), [firestore]);
  const { data: allDramas, isLoading } = useCollection<Drama>(dramasQuery);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredDramas = useMemo(() => {
    const dramas = allDramas || [];
    if (!searchQuery) {
      return dramas;
    }
    return dramas.filter((drama) =>
      drama.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allDramas, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredDramas.length / itemsPerPage);

  const paginatedDramas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDramas.slice(startIndex, endIndex);
  }, [filteredDramas, currentPage, itemsPerPage]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
            <h2 className="font-headline text-3xl md:text-4xl font-bold">Semua Drama</h2>
            <div className="relative w-full max-w-sm">
                <Input
                    type="search"
                    placeholder="Cari drama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-full shadow-sm bg-background"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
        </div>

        <Suspense fallback={<DramaGridSkeleton />}>
          {isLoading ? (
            <DramaGridSkeleton />
          ) : paginatedDramas.length > 0 ? (
            <AllDramasGrid dramas={paginatedDramas} />
          ) : (
            <div className="border-dashed border-2 rounded-lg p-8 text-center mt-4">
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Tidak ada drama yang cocok dengan pencarian Anda.'
                  : 'Belum ada drama yang tersedia. Tambahkan data ke koleksi "dramas" Firestore Anda.'
                }
              </p>
            </div>
          )}
        </Suspense>

        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Sebelumnya
                </Button>
                <span className="text-muted-foreground font-medium">
                    Halaman {currentPage} dari {totalPages}
                </span>
                <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Berikutnya
                </Button>
            </div>
        )}
      </section>
  )
}
