'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addCommentAction } from '@/lib/posts';
import type { Comment } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, User } from 'lucide-react';

const commentSchema = z.object({
  author: z.string().min(2, { message: "Name must be at least 2 characters." }),
  content: z.string().min(5, { message: "Comment must be at least 5 characters." }),
});

interface CommentSectionProps {
  postId: string;
  slug: string;
  initialComments: Comment[];
}

export default function CommentSection({ postId, slug, initialComments }: CommentSectionProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { author: "", content: "" },
  });

  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    const formData = new FormData();
    formData.append('author', values.author);
    formData.append('content', values.content);

    startTransition(async () => {
      try {
        await addCommentAction(postId, slug, formData);
        toast({ title: "Comment submitted!", description: "Thank you for your feedback." });
        form.reset();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit comment. Please try again.",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-headline font-semibold mb-6">Join the Conversation</h3>
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Comment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share your thoughts..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isPending ? 'Submitting...' : 'Submit Comment'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {initialComments.length > 0 && (
        <div className="space-y-8">
            <h3 className="text-2xl font-headline font-semibold flex items-center gap-2">
              <MessageCircle />
              <span>Comments ({initialComments.length})</span>
            </h3>
            {initialComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/20 text-primary">
                  <User />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-primary">{comment.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <p className="text-foreground/90 mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
