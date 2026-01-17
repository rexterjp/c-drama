import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import InstagramIcon from '@/components/icons/instagram-icon';
import WhatsAppIcon from '@/components/icons/whatsapp-icon';
import { Twitter, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background text-muted-foreground mt-16 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center gap-8">
          <Link href="/">
            <Image
              src="https://i.ibb.co/KxFGx3FJ/unnamed-1-1.png"
              alt="C-Drama Logo"
              width={120}
              height={30}
              className="h-auto"
            />
          </Link>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors">
              <Link href="https://www.instagram.com/candra.pramudya.arunita" target="_blank" rel="noopener noreferrer">
                <InstagramIcon className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors">
              <Link href="https://wa.me/6285646452979" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="h-6 w-6" />
                <span className="sr-only">WhatsApp</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors">
              <Link href="https://twitter.com/0xjson000" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">X / Twitter</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12 text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors">
              <Link href="https://t.me/candra_huang" target="_blank" rel="noopener noreferrer">
                <Send className="h-6 w-6" />
                <span className="sr-only">Telegram</span>
              </Link>
            </Button>
          </div>
          <div className="text-center text-sm space-y-1">
             <p>Portal Anda untuk drama pendek terbaik.</p>
             <p>&copy; {new Date().getFullYear()} C-Drama. Santai, hak cipta aman.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
