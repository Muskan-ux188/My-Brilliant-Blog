import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-accent"
            >
              <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z" />
              <path d="M12 21c-3.9 0-5-1.3-5-5" />
              <path d="M12 3c3.9 0 5 1.3 5 5" />
            </svg>
            <span>My Brilliant Blog</span>
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
