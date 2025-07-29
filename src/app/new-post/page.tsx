'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { addPostAction } from '@/lib/posts';
import { suggestPostTags } from '@/ai/flows/suggest-tags';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Loader2 } from 'lucide-react';

const postSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
});

export default function NewPostPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "" },
  });
  
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSuggestTags = async () => {
    const content = form.getValues('content');
    if (content.length < 20) {
      toast({ title: "Content too short", description: "Please write more content before suggesting tags.", variant: 'destructive' });
      return;
    }
    setIsSuggestingTags(true);
    setSuggestedTags([]);
    try {
      const result = await suggestPostTags({ content });
      const newSuggestions = result.tags.filter(t => !tags.includes(t.toLowerCase()));
      setSuggestedTags(newSuggestions);
    } catch (error) {
      toast({ title: "Error", description: "Could not suggest tags. Please try again.", variant: 'destructive' });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const addSuggestedTag = (tag: string) => {
    const lowercasedTag = tag.toLowerCase();
    if (!tags.includes(lowercasedTag)) {
        setTags([...tags, lowercasedTag]);
    }
    setSuggestedTags(suggestedTags.filter(t => t.toLowerCase() !== lowercasedTag));
  }

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('tags', tags.join(','));

      try {
        await addPostAction(formData);
        toast({ title: "Post created!", description: "Your brilliant post is now live." });
      } catch (error) {
        toast({ title: "Error", description: (error as Error).message || "Failed to create post.", variant: "destructive" });
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Create a New Post</CardTitle>
              <CardDescription>Share your brilliant thoughts with the world.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Post Title</FormLabel>
                    <FormControl>
                      <Input placeholder="My brilliant post title" {...field} />
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
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Once upon a time..." {...field} rows={15} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className="font-headline text-xl">Categorization</CardTitle>
                <CardDescription>Add tags to help people find your post.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
                        {tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-sm py-1 capitalize bg-primary/20 text-primary">
                                {tag}
                                <button type="button" onClick={() => removeTag(tag)} className="ml-2 rounded-full hover:bg-destructive/20 p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                    <FormControl>
                        <Input 
                            placeholder="Add a tag and press Enter" 
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                        />
                    </FormControl>
                </FormItem>

                <div>
                    <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggestingTags}>
                        {isSuggestingTags ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Suggest Tags with AI
                    </Button>
                </div>
                {suggestedTags.length > 0 && (
                     <div className="space-y-2 pt-2">
                        <p className="text-sm font-medium">Suggestions:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedTags.map(tag => (
                                <button type="button" key={tag} onClick={() => addSuggestedTag(tag)}>
                                    <Badge variant="outline" className="text-sm py-1 capitalize cursor-pointer hover:bg-accent hover:text-accent-foreground">
                                        + {tag}
                                    </Badge>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isPending ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
