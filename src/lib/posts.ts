'use server';

import type { Post } from '@/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

let posts: Post[] = [
  {
    id: '1',
    slug: 'getting-started-with-react-hooks',
    title: 'Getting Started with React Hooks',
    excerpt: 'A beginner-friendly guide to understanding and using the most common React Hooks. We\'ll look at useState for managing state and useEffect for handling side effects.',
    content: 'React Hooks revolutionized how we write components. Before hooks, class components were necessary for state and lifecycle methods. Now, we can do it all in functional components. The `useState` hook allows you to add state to your components. It\'s a function that returns an array with two elements: the current state value and a function to update it. The `useEffect` hook lets you perform side effects in your components, like fetching data or subscribing to an event. It runs after every render by default, but you can control when it runs by passing a dependency array.',
    createdAt: new Date('2024-05-10T10:00:00Z').toISOString(),
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    imageUrl: 'https://placehold.co/1200x600.png'
  },
  {
    id: '2',
    slug: 'building-modern-web-apps-with-nextjs',
    title: 'Building Modern Web Apps with Next.js',
    excerpt: 'Explore the powerful features of Next.js that make it a go-to framework for modern web development, including server-side rendering and file-based routing.',
    content: 'Next.js is a React framework that gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed. Its file-based routing system is intuitive; you just create files in the `pages` or `app` directory, and Next.js handles the routing. Server Components are a new addition that allow you to write UI that can be rendered and optionally cached on the server, leading to faster page loads and less client-side JavaScript.',
    createdAt: new Date('2024-06-22T14:30:00Z').toISOString(),
    tags: ['nextjs', 'react', 'fullstack', 'web-development'],
    imageUrl: 'https://placehold.co/1200x600.png'
  },
  {
    id: '3',
    slug: 'deploying-ai-models-with-genkit',
    title: 'Deploying AI Models with Genkit',
    excerpt: 'Learn how to easily build, test, and deploy AI-powered features in your applications using Firebase Genkit. A practical introduction to the future of AI development.',
    content: 'Firebase Genkit is a powerful, open-source framework designed to simplify the process of building and deploying AI-powered applications. It provides a cohesive set of tools for creating complex AI flows that can call models like Gemini, manage prompts, and even call other services or APIs. With Genkit, you can define flows in TypeScript or Go, test them locally with a built-in UI, and then deploy them to Firebase Cloud Functions or other serverless environments. This makes it incredibly efficient to add sophisticated AI capabilities, like content generation or data analysis, to your apps.',
    createdAt: new Date('2024-07-18T09:00:00Z').toISOString(),
    tags: ['ai', 'firebase', 'genkit', 'genai'],
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
    imageUrl: `https://placehold.co/1200x600.png`,
  };

  posts = [newPost, ...posts];
  
  revalidatePath('/');
  revalidatePath(`/posts/${newPost.slug}`);
  redirect(`/posts/${newPost.slug}`);
}
