import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InstagramIcon from '@/components/icons/instagram-icon';
import { Twitter, Send } from 'lucide-react';

export default function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">
        Minta Drama
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Tidak dapat menemukan short drama favorit Anda? Beri tahu kami! Hubungi langsung melalui media sosial untuk mengajukan permintaan. Kami selalu ingin memperluas koleksi kami berdasarkan masukan komunitas.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" className="h-12 text-lg rounded-full bg-[#E4405F] hover:bg-[#E4405F]/90 text-white">
          <Link href="https://www.instagram.com/candra.pramudya.arunita" target="_blank" rel="noopener noreferrer">
            <InstagramIcon className="mr-2 h-5 w-5" />
            Instagram
          </Link>
        </Button>
        <Button asChild size="lg" className="h-12 text-lg rounded-full bg-black hover:bg-black/90 text-white">
          <Link href="https://twitter.com/0xjson000" target="_blank" rel="noopener noreferrer">
            <Twitter className="mr-2 h-5 w-5" />
            X / Twitter
          </Link>
        </Button>
        <Button asChild size="lg" className="h-12 text-lg rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white">
          <Link href="https://t.me/candra_huang" target="_blank" rel="noopener noreferrer">
            <Send className="mr-2 h-5 w-5" />
            Telegram
          </Link>
        </Button>
      </div>
    </div>
  );
}
