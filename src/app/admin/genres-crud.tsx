'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Genre } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const genreSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
});

function GenreForm({ genre, onFinished }: { genre?: Genre, onFinished: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const genresCollection = useMemoFirebase(() => collection(firestore, 'genres'), [firestore]);
  
  const form = useForm<z.infer<typeof genreSchema>>({
    resolver: zodResolver(genreSchema),
    defaultValues: genre || { name: '' },
  });

  async function onSubmit(values: z.infer<typeof genreSchema>) {
     try {
      if (genre) {
        const genreRef = doc(firestore, 'genres', genre.id);
        updateDocumentNonBlocking(genreRef, values);
        toast({ title: 'Genre Diperbarui', description: `${values.name} telah diperbarui.` });
      } else {
        addDocumentNonBlocking(genresCollection, values);
        toast({ title: 'Genre Dibuat', description: `${values.name} telah dibuat.` });
      }
      onFinished();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: e.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <DialogFooter>
          <DialogClose asChild><Button variant="ghost">Batal</Button></DialogClose>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function GenresCrud() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | undefined>(undefined);

  const genresCollection = useMemoFirebase(() => collection(firestore, 'genres'), [firestore]);
  const { data: genres, isLoading } = useCollection<Genre>(genresCollection);
  
  const handleEdit = (genre: Genre) => {
    setEditingGenre(genre);
    setIsFormOpen(true);
  };
  
  const handleAddNew = () => {
    setEditingGenre(undefined);
    setIsFormOpen(true);
  };
  
  const handleDelete = (genre: Genre) => {
    const genreRef = doc(firestore, 'genres', genre.id);
    deleteDocumentNonBlocking(genreRef);
    toast({ title: 'Genre Dihapus', description: `${genre.name} telah dihapus. Catatan: Ini tidak menghapus genre dari drama yang ada.` });
  };
  
  const onFormFinished = () => {
    setIsFormOpen(false);
    setEditingGenre(undefined);
  }

  if (isLoading) {
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
        <h2 className="text-2xl font-bold">Kelola Genre</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Genre Baru</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader><DialogTitle>{editingGenre ? 'Ubah Genre' : 'Tambah Genre Baru'}</DialogTitle></DialogHeader>
                <GenreForm genre={editingGenre} onFinished={onFormFinished} />
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {genres && genres.length > 0 ? genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell className="font-medium">{genre.name}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(genre)}><Edit className="h-4 w-4" /></Button>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Ini akan menghapus genre "{genre.name}" secara permanen. Ini tidak akan menghapus genre dari drama yang sudah menggunakannya.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(genre)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={2} className="text-center">Tidak ada genre ditemukan.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
