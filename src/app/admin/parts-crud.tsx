'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Part, Drama } from '@/lib/data';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Edit, Trash2, Check, ChevronsUpDown, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function DramaPickerDialog({
  isOpen,
  onClose,
  dramas,
  onSelectDrama,
  currentDramaId
}: {
  isOpen: boolean;
  onClose: () => void;
  dramas: Drama[];
  onSelectDrama: (id: string) => void;
  currentDramaId: string | undefined;
}) {
  const [search, setSearch] = useState('');

  const filteredDramas = useMemo(() => {
    if (!search) return dramas;
    return dramas.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  }, [dramas, search]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Drama</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
            <Input 
                placeholder="Cari drama..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10"
            />
            <ScrollArea className="h-72 rounded-md border">
                <div className="p-2">
                    {filteredDramas.length > 0 ? filteredDramas.map((drama) => (
                        <Button
                            variant="ghost"
                            key={drama.id}
                            onClick={() => {
                                onSelectDrama(drama.id);
                                onClose();
                            }}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                currentDramaId === drama.id && "bg-accent"
                            )}
                        >
                            <Check
                                className={cn(
                                "mr-2 h-4 w-4",
                                currentDramaId === drama.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            {drama.title}
                        </Button>
                    )) : <p className="p-2 text-center text-sm text-muted-foreground">Drama tidak ditemukan.</p>}
                </div>
            </ScrollArea>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Batal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


const partSchema = z.object({
  dramaId: z.string().min(1, 'Drama harus diisi'),
  partNumber: z.coerce.number().min(1, 'Nomor part minimal 1'),
  title: z.string().min(1, 'Judul harus diisi'),
  videoUrl: z.string().url('Harus berupa URL yang valid'),
  duration: z.string().min(1, 'Durasi harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
});

function PartForm({ part, dramas, onFinished }: { part?: Part, dramas: Drama[], onFinished: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const partsCollection = useMemoFirebase(() => collection(firestore, 'parts'), [firestore]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const form = useForm<z.infer<typeof partSchema>>({
    resolver: zodResolver(partSchema),
    defaultValues: part || {
      dramaId: '',
      partNumber: 1,
      title: '',
      videoUrl: '',
      duration: '',
      description: '',
    },
  });
  
  async function onSubmit(values: z.infer<typeof partSchema>) {
    try {
      if (part) {
        const partRef = doc(firestore, 'parts', part.id);
        updateDocumentNonBlocking(partRef, values);
        toast({ title: 'Part Diperbarui', description: `Part ${values.partNumber} telah diperbarui.` });
      } else {
        addDocumentNonBlocking(partsCollection, values);
        toast({ title: 'Part Dibuat', description: `Part ${values.partNumber} telah dibuat.` });
      }
      onFinished();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: e.message });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField
          control={form.control}
          name="dramaId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Drama</FormLabel>
              <FormControl>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPickerOpen(true)}
                    className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                    )}
                    >
                    {field.value
                        ? dramas.find(
                            (drama) => drama.id === field.value
                        )?.title
                        : "Pilih drama"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
              <DramaPickerDialog 
                  isOpen={isPickerOpen}
                  onClose={() => setIsPickerOpen(false)}
                  dramas={dramas}
                  currentDramaId={field.value}
                  onSelectDrama={(dramaId) => {
                      field.onChange(dramaId)
                  }}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="partNumber" render={({ field }) => (
          <FormItem><FormLabel>Nomor Part</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Judul</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="videoUrl" render={({ field }) => (
          <FormItem><FormLabel>URL Video</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="duration" render={({ field }) => (
          <FormItem><FormLabel>Durasi (cth: 45mnt)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <DialogFooter className="sticky bottom-0 bg-background pt-4">
          <DialogClose asChild><Button variant="ghost">Batal</Button></DialogClose>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function PartsCrud() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const partsCollection = useMemoFirebase(() => collection(firestore, 'parts'), [firestore]);
  const { data: parts, isLoading: partsLoading } = useCollection<Part>(partsCollection);
  
  const dramasCollection = useMemoFirebase(() => collection(firestore, 'dramas'), [firestore]);
  const { data: dramas, isLoading: dramasLoading } = useCollection<Drama>(dramasCollection);
  
  const groupedParts = useMemo(() => {
    if (!parts || !dramas) return new Map<string, { dramaTitle: string; parts: Part[] }>();

    const dramaMap = new Map(dramas.map(d => [d.id, d.title]));
    const groups = new Map<string, { dramaTitle: string; parts: Part[] }>();

    parts.forEach(part => {
        const dramaTitle = dramaMap.get(part.dramaId) || 'Drama Tidak Dikenal';
        if (!groups.has(part.dramaId)) {
            groups.set(part.dramaId, { dramaTitle, parts: [] });
        }
        groups.get(part.dramaId)!.parts.push(part);
    });

    groups.forEach(group => {
      group.parts.sort((a, b) => a.partNumber - b.partNumber);
    });
    
    return new Map([...groups.entries()].sort((a, b) => a[1].dramaTitle.localeCompare(b[1].dramaTitle)));
  }, [parts, dramas]);
  
  const filteredDramaGroups = useMemo(() => {
      if (!searchQuery) return Array.from(groupedParts.entries());

      return Array.from(groupedParts.entries()).filter(([_, groupData]) => 
          groupData.dramaTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [groupedParts, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredDramaGroups.length / itemsPerPage);

  const paginatedDramaGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDramaGroups.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDramaGroups, currentPage, itemsPerPage]);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleEdit = (part: Part) => {
    setEditingPart(part);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingPart(undefined);
    setIsFormOpen(true);
  };
  
  const handleDelete = (part: Part) => {
    const partRef = doc(firestore, 'parts', part.id);
    deleteDocumentNonBlocking(partRef);
    toast({ title: 'Part Dihapus', description: `Part ${part.partNumber} telah dihapus.` });
  };
  
  const onFormFinished = () => {
    setIsFormOpen(false);
    setEditingPart(undefined);
  }

  if (partsLoading || dramasLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40 self-end" />
        <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold">Kelola Part</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Input
                    type="search"
                    placeholder="Cari drama..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button onClick={handleAddNew} className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Tambah Part Baru</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader><DialogTitle>{editingPart ? 'Ubah Part' : 'Tambah Part Baru'}</DialogTitle></DialogHeader>
                    <PartForm part={editingPart} dramas={dramas || []} onFinished={onFormFinished} />
                </DialogContent>
            </Dialog>
        </div>
      </div>
      
      {paginatedDramaGroups.length > 0 ? (
        <Accordion type="multiple" className="w-full space-y-4">
            {paginatedDramaGroups.map(([dramaId, groupData]) => (
                <AccordionItem value={dramaId} key={dramaId} className="border rounded-lg bg-card">
                    <AccordionTrigger className="px-4 py-3 text-lg font-semibold hover:no-underline">
                        {groupData.dramaTitle}
                    </AccordionTrigger>
                    <AccordionContent className="px-1 pb-1">
                        <div className="rounded-md border-t">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Part #</TableHead>
                                        <TableHead>Judul</TableHead>
                                        <TableHead className="w-[120px]">Durasi</TableHead>
                                        <TableHead className="text-right w-[100px]">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {groupData.parts.map((part) => (
                                        <TableRow key={part.id}>
                                            <TableCell>{part.partNumber}</TableCell>
                                            <TableCell className="font-medium">{part.title}</TableCell>
                                            <TableCell>{part.duration}</TableCell>
                                            <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(part)}><Edit className="h-4 w-4" /></Button>
                                            
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus part {part.partNumber} dari "{groupData.dramaTitle}" secara permanen.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(part)}>Hapus</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      ) : (
        <div className="border-dashed border-2 rounded-lg p-8 text-center mt-4">
            <p className="text-muted-foreground">{searchQuery ? 'Tidak ada drama yang cocok dengan pencarian Anda.' : 'Tidak ada part ditemukan.'}</p>
        </div>
      )}

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
    </div>
  );
}
