'use client';

import { useState, useMemo } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Edit, Trash2, Check, ChevronsUpDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredDramas = useMemo(() => {
    if (!search) return dramas;
    return dramas.filter(d => d.title.toLowerCase().includes(search.toLowerCase()));
  }, [dramas, search]);

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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
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
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Input 
                        placeholder="Cari drama..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9 rounded-b-none border-x-0 border-t-0"
                    />
                    <ScrollArea className="h-72">
                        {filteredDramas.map((drama) => (
                            <div
                                key={drama.id}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    field.onChange(drama.id);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                className="text-sm p-2 rounded-sm hover:bg-accent cursor-pointer flex items-center w-full text-left"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  drama.id === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {drama.title}
                            </div>
                        ))}
                        {!filteredDramas.length && <p className="p-2 text-center text-sm text-muted-foreground">Drama tidak ditemukan.</p>}
                    </ScrollArea>
                </PopoverContent>
              </Popover>
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

  const partsCollection = useMemoFirebase(() => collection(firestore, 'parts'), [firestore]);
  const { data: parts, isLoading: partsLoading } = useCollection<Part>(partsCollection);
  
  const dramasCollection = useMemoFirebase(() => collection(firestore, 'dramas'), [firestore]);
  const { data: dramas, isLoading: dramasLoading } = useCollection<Drama>(dramasCollection);
  
  const dramaTitleMap = useMemo(() => {
      if (!dramas) return new Map();
      return new Map(dramas.map(d => [d.id, d.title]));
  }, [dramas])

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
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Kelola Part</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Part Baru</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader><DialogTitle>{editingPart ? 'Ubah Part' : 'Tambah Part Baru'}</DialogTitle></DialogHeader>
                <PartForm part={editingPart} dramas={dramas || []} onFinished={onFormFinished} />
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drama</TableHead>
              <TableHead>Part #</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts && parts.length > 0 ? parts.sort((a,b) => a.partNumber - b.partNumber).map((part) => (
              <TableRow key={part.id}>
                <TableCell className="font-medium">{dramaTitleMap.get(part.dramaId) || 'Drama Tidak Dikenal'}</TableCell>
                <TableCell>{part.partNumber}</TableCell>
                <TableCell>{part.title}</TableCell>
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
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus part {part.partNumber} dari "{dramaTitleMap.get(part.dramaId)}" secara permanen.
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
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">Tidak ada part ditemukan.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
