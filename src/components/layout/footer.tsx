import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground mt-16 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <Link href="/" className="inline-block mb-2">
              <Image
                src="https://i.ibb.co/wF450cnb/unnamed-2.png"
                alt="C-Pop Now Logo"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm">Portal Anda untuk drama China terbaik.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-sm hover:underline hover:text-foreground">Beranda</Link>
            <Link href="/request" className="text-sm hover:underline hover:text-foreground">Permintaan</Link>
            <Link href="#" className="text-sm hover:underline hover:text-foreground">Kontak</Link>
          </div>
        </div>
        <div className="text-center mt-8 border-t pt-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} C-Pop Now. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
