import { getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Tag } from '@/components/Tag';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }
  
  const postCategoryHint = post.tags.length > 0 ? post.tags[0] : "blog post";

  return (
    <article className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-4 text-primary">{post.title}</h1>
        <div className="flex justify-center items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 896px"
          priority
          data-ai-hint={postCategoryHint}
        />
      </div>
      
      <div className="prose lg:prose-xl max-w-none w-full">
        <p>{post.content}</p>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-12 pt-6 border-t border-border/80">
          <div className="flex items-center gap-2 mb-4">
            <TagIcon className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-headline font-semibold">Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Tag key={tag} text={tag} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
