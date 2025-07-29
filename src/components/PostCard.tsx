import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import type { Post } from '@/types';
import { Tag } from '@/components/Tag';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const postCategoryHint = post.tags.length > 0 ? post.tags.join(" ") : "blog post";
  return (
    <Link href={`/posts/${post.slug}`} className="group">
      <Card className="h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 border-border/80 hover:border-primary/50 overflow-hidden">
        <CardHeader className="p-0">
          <div className="aspect-video relative overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={postCategoryHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6 space-y-3">
          <CardTitle className="text-xl font-headline group-hover:text-accent transition-colors">
            {post.title}
          </CardTitle>
          <p className="text-muted-foreground line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.slice(0, 3).map(tag => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 text-sm text-muted-foreground flex justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
