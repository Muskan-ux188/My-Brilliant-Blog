'use server';

import type { Post, Comment } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

let posts: Post[] = [
  {
    id: '1',
    slug: 'journey-into-minimalism',
    title: 'My Journey into Minimalism',
    excerpt: 'Discover how embracing minimalism transformed my life, one small step at a time. It\'s not just about having less, but about making room for more of what truly matters.',
    content: 'The journey began on a rainy Tuesday. Surrounded by clutter, I felt a sense of being overwhelmed. That was the day I decided to change. Minimalism wasn\'t just about decluttering my physical space; it was about decluttering my mind. I started with a single drawer. Then a closet. Soon, my entire home felt lighter, and so did I. This post documents the steps, the challenges, and the profound peace I found in simplicity. It\'s a continuous process, not a destination, but every day feels more intentional than the last.',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    tags: ['minimalism', 'lifestyle', 'self-improvement'],
    comments: [
      { id: 'c1', author: 'Jane Doe', content: 'So inspiring! I\'m starting my own journey today.', createdAt: new Date('2023-10-26T12:30:00Z').toISOString() },
    ],
    imageUrl: 'https://placehold.co/1200x600.png'
  },
  {
    id: '2',
    slug: 'the-art-of-baking-sourdough',
    title: 'The Art of Baking Sourdough',
    excerpt: 'From starter to loaf, this guide demystifies the process of baking delicious sourdough bread at home. Patience is the key ingredient.',
    content: 'Baking sourdough is a dance with nature. It starts with a simple mix of flour and water, which, over time, cultivates wild yeast and bacteria. This living culture, your starter, is the heart of your bread. Feeding it, watching it grow, and understanding its rhythms is an art form. This guide will walk you through creating and maintaining a starter, the folding and shaping techniques, and the final magical bake that yields a crusty, tangy, and deeply satisfying loaf. Prepare to fall in love with baking.',
    createdAt: new Date('2023-11-15T14:30:00Z').toISOString(),
    tags: ['baking', 'food', 'hobby', 'sourdough'],
    comments: [
      { id: 'c2', author: 'John Smith', content: 'Great guide! My first loaf was a success thanks to you.', createdAt: new Date('2023-11-16T09:00:00Z').toISOString() },
      { id: 'c3', author: 'Emily White', content: 'My starter is bubbling away!', createdAt: new Date('2023-11-17T11:45:00Z').toISOString() },
    ],
    imageUrl: 'https://placehold.co/1200x600.png'
  },
  {
    id: '3',
    slug: 'a-guide-to-urban-gardening',
    title: 'A Guide to Urban Gardening',
    excerpt: 'No backyard? No problem. Learn how to grow your own food and create a green oasis in any urban space, from balconies to windowsills.',
    content: 'City living doesn\'t mean you have to give up on your green thumb. Urban gardening is about making the most of small spaces. Whether you have a tiny balcony, a sunny windowsill, or a small patio, you can grow fresh herbs, vegetables, and beautiful flowers. We\'ll cover container gardening, vertical gardens, soil mixes, watering schedules, and pest control for small-scale urban farms. It\'s a rewarding way to connect with your food and bring a piece of nature into your concrete jungle.',
    createdAt: new Date('2024-02-05T09:00:00Z').toISOString(),
    tags: ['gardening', 'urban living', 'sustainability', 'diy'],
    comments: [],
    imageUrl: 'https://placehold.co/1200x600.png'
  }
];

const createSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
const createExcerpt = (content: string) => content.split(' ').slice(0, 25).join(' ') + '...';

export async function getPosts(query?: string): Promise<Post[]> {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
  let filteredPosts = posts;
  if (query) {
    filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
  return filteredPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return posts.find(post => post.slug === slug);
}

export async function addPostAction(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const tags = formData.get('tags') as string;

  if (!title || !content) {
    throw new Error('Title and content are required.');
  }

  const newPost: Post = {
    id: String(Date.now()),
    title,
    content,
    slug: createSlug(title) || String(Date.now()),
    excerpt: createExcerpt(content),
    createdAt: new Date().toISOString(),
    tags: tags ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean) : [],
    comments: [],
    imageUrl: `https://placehold.co/1200x600.png`,
  };

  posts = [newPost, ...posts];
  
  revalidatePath('/');
  revalidatePath(`/posts/${newPost.slug}`);
  redirect(`/posts/${newPost.slug}`);
}

export async function addCommentAction(postId: string, slug: string, formData: FormData) {
  const author = formData.get('author') as string;
  const content = formData.get('content') as string;

  if (!author || !content) {
    throw new Error('Name and comment are required.');
  }

  const postIndex = posts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    const newComment: Comment = {
      id: String(Date.now()),
      author,
      content,
      createdAt: new Date().toISOString(),
    };
    posts[postIndex].comments.unshift(newComment);
  }
  
  revalidatePath(`/posts/${slug}`);
}
