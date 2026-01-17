import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground mt-16 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p className="font-headline text-xl font-bold text-foreground">C-Pop Now</p>
            <p className="text-sm">Your portal to the best Chinese dramas.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-sm hover:underline hover:text-foreground">Home</Link>
            <Link href="/request" className="text-sm hover:underline hover:text-foreground">Request</Link>
            <Link href="#" className="text-sm hover:underline hover:text-foreground">Contact</Link>
          </div>
        </div>
        <div className="text-center mt-8 border-t pt-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} C-Pop Now. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
