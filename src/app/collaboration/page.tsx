import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InstagramIcon from '@/components/icons/instagram-icon';
import { Twitter, Send } from 'lucide-react';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';

export default function CollaborationPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">
        Mari Berkolaborasi
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Tertarik untuk berkolaborasi dalam proyek drama pendek? Kami terbuka untuk ide-ide baru dan kemitraan. Hubungi kami melalui media sosial untuk mendiskusikan potensi kolaborasi.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" className="h-12 text-lg rounded-full bg-[#E4405F] hover:bg-[#E4405F]/90 text-white">
          <Link href="https://www.instagram.com/candra.pramudya.arunita" target="_blank" rel="noopener noreferrer">
            <InstagramIcon className="mr-2 h-5 w-5" />
            Instagram
          </Link>
        </Button>
        <Button asChild size="lg" className="h-12 text-lg rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white">
            <Link href="https://wa.me/6285646452979" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="mr-2 h-5 w-5" />
              WhatsApp
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
