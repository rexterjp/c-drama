import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InstagramIcon from '@/components/icons/instagram-icon';
import { Twitter, Send } from 'lucide-react';

export default function RequestPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 text-center">
      <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">
        Request a Drama
      </h1>
      <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Can't find your favorite Chinese drama? Let us know! Reach out directly via social media to make a request. We're always looking to expand our collection based on community feedback.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" className="h-12 text-lg rounded-full" variant="outline">
          <Link href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramIcon className="mr-2 h-5 w-5" />
            Instagram
          </Link>
        </Button>
        <Button asChild size="lg" className="h-12 text-lg rounded-full" variant="outline">
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="mr-2 h-5 w-5" />
            X / Twitter
          </Link>
        </Button>
        <Button asChild size="lg" className="h-12 text-lg rounded-full" variant="outline">
          <Link href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <Send className="mr-2 h-5 w-5" />
            Telegram
          </Link>
        </Button>
      </div>
    </div>
  );
}
