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
                src="https://i.ibb.co/KxFGx3FJ/unnamed-1-1.png"
                alt="C-Drama Logo"
                width={200}
                height={50}
                className="h-[120px] w-auto"
              />
            </Link>
            <p className="text-sm">Portal Anda untuk short drama terbaik.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/" className="text-sm hover:underline hover:text-foreground">Beranda</Link>
            <Link href="/request" className="text-sm hover:underline hover:text-foreground">Permintaan</Link>
            <Link href="#" className="text-sm hover:underline hover:text-foreground">Kontak</Link>
          </div>
        </div>
        <div className="text-center mt-8 border-t pt-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} C-Drama. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
