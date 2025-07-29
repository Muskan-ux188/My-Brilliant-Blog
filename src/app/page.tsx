'use client';

import { useState, useEffect, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getPosts } from '@/lib/posts';
import type { Post } from '@/types';
import PostCard from '@/components/PostCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setIsLoading(true);
    getPosts(initialQuery).then(fetchedPosts => {
      setPosts(fetchedPosts);
      setIsLoading(false);
    });
  }, [initialQuery]);
  
  const handleSearch = (term: string) => {
    setQuery(term);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for posts, topics, or tags..."
          className="pl-10 w-full md:w-1/2 lg:w-1/3"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {(isLoading || isPending) ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map(post => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="col-span-full text-center py-16">
            <h2 className="text-2xl font-headline">No posts found</h2>
            <p className="text-muted-foreground">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
