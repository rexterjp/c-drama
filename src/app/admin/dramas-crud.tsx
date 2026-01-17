'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, doc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { Drama, Genre } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


const dramaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  synopsis: z.string().min(1, 'Synopsis is required'),
  posterUrl: z.string().url('Must be a valid URL'),
  rating: z.coerce.number().min(0).max(10),
  isTrending: z.boolean().default(false),
  isHot: z.boolean().default(false),
  genreIds: z.array(z.string()).default([]),
});

function DramaForm({ drama, genres, onFinished }: { drama?: Drama, genres: Genre[], onFinished: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const dramasCollection = useMemoFirebase(() => collection(firestore, 'dramas'), [firestore]);

  const form = useForm<z.infer<typeof dramaSchema>>({
    resolver: zodResolver(dramaSchema),
    defaultValues: drama ? { ...drama, rating: drama.rating || 0 } : {
      title: '',
      synopsis: '',
      posterUrl: '',
      rating: 0,
      isTrending: false,
      isHot: false,
      genreIds: [],
    },
  });

  async function onSubmit(values: z.infer<typeof dramaSchema>) {
    try {
      if (drama) {
        const dramaRef = doc(firestore, 'dramas', drama.id);
        updateDocumentNonBlocking(dramaRef, values);
        toast({ title: 'Drama Updated', description: `${values.title} has been updated.` });
      } else {
        addDocumentNonBlocking(dramasCollection, values);
        toast({ title: 'Drama Created', description: `${values.title} has been created.` });
      }
      onFinished();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="synopsis" render={({ field }) => (
          <FormItem><FormLabel>Synopsis</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="posterUrl" render={({ field }) => (
          <FormItem><FormLabel>Poster URL (imgbb)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="rating" render={({ field }) => (
          <FormItem><FormLabel>Rating</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="flex gap-8">
            <FormField control={form.control} name="isTrending" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-x-4">
                <FormLabel>Trending</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
            )} />
            <FormField control={form.control} name="isHot" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm space-x-4">
                <FormLabel>Hot</FormLabel>
                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
            )} />
        </div>
        <FormField control={form.control} name="genreIds" render={() => (
            <FormItem>
                <FormLabel>Genres</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => (
                    <FormField
                    key={genre.id}
                    control={form.control}
                    name="genreIds"
                    render={({ field }) => {
                        return (
                        <FormItem key={genre.id} className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                            <Checkbox
                                checked={field.value?.includes(genre.id)}
                                onCheckedChange={(checked) => {
                                return checked
                                    ? field.onChange([...(field.value || []), genre.id])
                                    : field.onChange(field.value?.filter((value) => value !== genre.id));
                                }}
                            />
                            </FormControl>
                            <FormLabel className="font-normal">{genre.name}</FormLabel>
                        </FormItem>
                        );
                    }}
                    />
                ))}
                </div>
            </FormItem>
        )}/>
        
        <DialogFooter className="sticky bottom-0 bg-background pt-4">
          <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
          <Button type="submit">Save</Button>
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

  const genresCollection = useMemoFirebase(() => collection(firestore, 'genres'), [firestore]);
  const { data: genres, isLoading: genresLoading } = useCollection<Genre>(genresCollection);
  
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
    toast({ title: 'Drama Deleted', description: `${drama.title} has been deleted.` });
  };
  
  const onFormFinished = () => {
    setIsFormOpen(false);
    setEditingDrama(undefined);
  }

  if (dramasLoading || genresLoading) {
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
        <h2 className="text-2xl font-bold">Manage Dramas</h2>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Add New Drama</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editingDrama ? 'Edit Drama' : 'Add New Drama'}</DialogTitle>
                </DialogHeader>
                <DramaForm drama={editingDrama} genres={genres || []} onFinished={onFormFinished} />
            </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Trending</TableHead>
              <TableHead>Hot</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dramas && dramas.length > 0 ? dramas.map((drama) => (
              <TableRow key={drama.id}>
                <TableCell className="font-medium">{drama.title}</TableCell>
                <TableCell>{drama.rating}</TableCell>
                <TableCell>{drama.isTrending ? 'Yes' : 'No'}</TableCell>
                <TableCell>{drama.isHot ? 'Yes' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(drama)}><Edit className="h-4 w-4" /></Button>
                  
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the drama "{drama.title}".
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(drama)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">No dramas found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
