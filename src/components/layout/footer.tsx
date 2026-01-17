import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-transparent text-muted-foreground mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-headline text-xl font-bold text-foreground mb-4 md:mb-0">C-Pop Now</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline hover:text-foreground">About</Link>
            <Link href="#" className="hover:underline hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:underline hover:text-foreground">Privacy Policy</Link>
          </div>
        </div>
        <div className="text-center mt-8 border-t pt-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} C-Pop Now. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
