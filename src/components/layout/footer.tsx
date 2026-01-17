import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="font-headline text-xl font-bold uppercase mb-4 md:mb-0">C-Pop Now</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:underline">About</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
            <Link href="#" className="hover:underline">Privacy Policy</Link>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} C-Pop Now. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
