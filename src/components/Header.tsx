import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
            My Brilliant Blog
          </Link>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/new-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
