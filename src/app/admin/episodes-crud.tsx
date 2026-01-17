'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Episode, Drama } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const episodeSchema = z.object({
  dramaId: z.string().min(1, 'Drama harus diisi'),
  episodeNumber: z.coerce.number().min(1, 'Nomor episode minimal 1'),
  title: z.string().min(1, 'Judul harus diisi'),
  videoUrl: z.string().url('Harus berupa URL yang valid'),
  duration: z.string().min(1, 'Durasi harus diisi'),
  description: z.string().min(1, 'Deskripsi harus diisi'),
});

function EpisodeForm({ episode, dramas, onFinished }: { episode?: Episode, dramas: Drama[], onFinished: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const episodesCollection = useMemoFirebase(() => collection(firestore, 'episodes'), [firestore]);

  const form = useForm<z.infer<typeof episodeSchema>>({
    resolver: zodResolver(episodeSchema),
    defaultValues: episode || {
      dramaId: '',
      episodeNumber: 1,
      title: '',
      videoUrl: '',
      duration: '',
      description: '',
    },
  });

  async function onSubmit(values: z.infer<typeof episodeSchema>) {
    try {
      if (episode) {
        const episodeRef = doc(firestore, 'episodes', episode.id);
        updateDocumentNonBlocking(episodeRef, values);
        toast({ title: 'Episode Diperbarui', description: `Episode ${values.episodeNumber} telah diperbarui.` });
      } else {
        addDocumentNonBlocking(episodesCollection, values);
        toast({ title: 'Episode Dibuat', description: `Episode ${values.episodeNumber} telah dibuat.` });
      }
      onFinished();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Kesalahan', description: e.message });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField control={form.control} name="dramaId" render={({ field }) => (
            <FormItem>
                <FormLabel>Drama</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Pilih drama" /></SelectTrigger></FormControl>
                    <SelectContent>
                        {dramas.map((drama) => <SelectItem key={drama.id} value={drama.id}>{drama.title}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )}/>
        <FormField control={form.control} name="episodeNumber" render={({ field }) => (
          <FormItem><FormLabel>Nomor Episode</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
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

export default function EpisodesCrud() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEpisode, setEditingEpisode] = useState<Episode | undefined>(undefined);

  const episodesCollection = useMemoFirebase(() => collection(firestore, 'episodes'), [firestore]);
  const { data: episodes, isLoading: episodesLoading } = useCollection<Episode>(episodesCollection);
  
  const dramasCollection = useMemoFirebase(() => collection(firestore, 'dramas'), [firestore]);
  const { data: dramas, isLoading: dramasLoading } = useCollection<Drama>(dramasCollection);
  
  const dramaTitleMap = useMemo(() => {
      if (!dramas) return new Map();
      return new Map(dramas.map(d => [d.id, d.title]));
  }, [dramas])

  const handleEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingEpisode(undefined);
    setIsFormOpen(true);
  };
  
  const handleDelete = (episode: Episode) => {
    const episodeRef = doc(firestore, 'episodes', episode.id);
    deleteDocumentNonBlocking(episodeRef);
    toast({ title: 'Episode Dihapus', description: `Episode ${episode.episodeNumber} telah dihapus.` });
  };
  
  const onFormFinished = () => {
    setIsFormOpen(false);
    setEditingEpisode(undefined);
  }

  if (episodesLoading || dramasLoading) {
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
        <h2 className="text-2xl font-bold">Kelola Episode</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Tambah Episode Baru</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader><DialogTitle>{editingEpisode ? 'Ubah Episode' : 'Tambah Episode Baru'}</DialogTitle></DialogHeader>
                <EpisodeForm episode={editingEpisode} dramas={dramas || []} onFinished={onFormFinished} />
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Drama</TableHead>
              <TableHead>Ep #</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Durasi</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {episodes && episodes.length > 0 ? episodes.sort((a,b) => a.episodeNumber - b.episodeNumber).map((episode) => (
              <TableRow key={episode.id}>
                <TableCell className="font-medium">{dramaTitleMap.get(episode.dramaId) || 'Drama Tidak Dikenal'}</TableCell>
                <TableCell>{episode.episodeNumber}</TableCell>
                <TableCell>{episode.title}</TableCell>
                <TableCell>{episode.duration}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(episode)}><Edit className="h-4 w-4" /></Button>
                  
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  Tindakan ini tidak dapat dibatalkan. Ini akan menghapus episode {episode.episodeNumber} dari "{dramaTitleMap.get(episode.dramaId)}" secara permanen.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(episode)}>Hapus</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">Tidak ada episode ditemukan.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
