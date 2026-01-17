'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Drama } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


const dramaSchema = z.object({
  title: z.string().min(1, 'Judul harus diisi'),
  posterUrl: z.string().min(1, 'URL Poster harus diisi'),
  isTrending: z.boolean().default(false),
  isHot: z.boolean().default(false),
});

function DramaForm({ drama, onFinished }: { drama?: Drama, onFinished: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const dramasCollection = useMemoFirebase(() => collection(firestore, 'dramas'), [firestore]);

  const form = useForm<z.infer<typeof dramaSchema>>({
    resolver: zodResolver(dramaSchema),
    defaultValues: drama ? drama : {
      title: '',
      posterUrl: '',
      isTrending: false,
      isHot: false,
    },
  });

  async function onSubmit(values: z.infer<typeof dramaSchema>) {
    try {
      const submittedValues = { ...values };
      const imgTagRegex = /<img src="([^"]+)"/;
      const match = submittedValues.posterUrl.match(imgTagRegex);

      if (match && match[1]) {
        submittedValues.posterUrl = match[1];
      }

      if (drama) {
        const dramaRef = doc(firestore, 'dramas', drama.id);
        updateDocumentNonBlocking(dramaRef, submittedValues);
        toast({ title: 'Drama Diperbarui', description: `${submittedValues.title} telah diperbarui.` });
      } else {
        addDocumentNonBlocking(dramasCollection, submittedValues);
        toast({ title: 'Drama Dibuat', description: `${submittedValues.title} telah dibuat.` });
      }
      onFinished();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: e.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Judul</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="posterUrl" render={({ field }) => (
          <FormItem><FormLabel>URL Poster (imgbb)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex gap-8">
            <FormField control={form.control} name="isTrending" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-x-4">
                <FormLabel>Tren</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
            )} />
            <FormField control={form.control} name="isHot" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-x-4">
                <FormLabel>Populer</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
            )} />
        </div>
        
        <DialogFooter className="sticky bottom-0 bg-background pt-4">
          <DialogClose asChild><Button variant="ghost">Batal</Button></DialogClose>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}


export default function DramasCrud() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDrama, setEditingDrama] = useState<Drama | undefined>(undefined);

  const dramasCollection = useMemoFirebase(() => collection(firestore, 'dramas'), [firestore]);
  const { data: dramas, isLoading: dramasLoading } = useCollection<Drama>(dramasCollection);

  const handleEdit = (drama: Drama) => {
    setEditingDrama(drama);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingDrama(undefined);
    setIsFormOpen(true);
  };
  
  const handleDelete = (drama: Drama) => {
    const dramaRef = doc(firestore, 'dramas', drama.id);
    deleteDocumentNonBlocking(dramaRef);
    toast({ title: 'Drama Dihapus', description: `${drama.title} telah dihapus.` });
  };
  
  const onFormFinished = () => {
    setIsFormOpen(false);
    setEditingDrama(undefined);
  }

  if (dramasLoading) {
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
        <h2 className="text-2xl font-bold">Kelola Drama</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Drama Baru</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{editingDrama ? 'Ubah Drama' : 'Tambah Drama Baru'}</DialogTitle>
                </DialogHeader>
                <DramaForm drama={editingDrama} onFinished={onFormFinished} />
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Tren</TableHead>
              <TableHead>Populer</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dramas && dramas.length > 0 ? dramas.map((drama) => (
              <TableRow key={drama.id}>
                <TableCell className="font-medium">{drama.title}</TableCell>
                <TableCell>{drama.isTrending ? 'Ya' : 'Tidak'}</TableCell>
                <TableCell>{drama.isHot ? 'Ya' : 'Tidak'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(drama)}><Edit className="h-4 w-4" /></Button>
                  
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus drama "{drama.title}" secara permanen.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(drama)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">Tidak ada drama ditemukan.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
