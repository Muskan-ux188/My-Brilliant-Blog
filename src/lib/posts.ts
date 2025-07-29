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
    createdAt: new Date('2024-07-22T10:00:00Z').toISOString(),
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '2',
    slug: 'building-modern-web-apps-with-nextjs',
    title: 'Building Modern Web Apps with Next.js',
    excerpt: 'Explore the powerful features of Next.js that make it a go-to framework for modern web development, including server-side rendering and file-based routing.',
    content: 'Next.js is a React framework that gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more. No config needed. Its file-based routing system is intuitive; you just create files in the `pages` or `app` directory, and Next.js handles the routing. Server Components are a new addition that allow you to write UI that can be rendered and optionally cached on the server, leading to faster page loads and less client-side JavaScript.',
    createdAt: new Date('2024-07-21T14:30:00Z').toISOString(),
    tags: ['nextjs', 'react', 'fullstack', 'web-development'],
    imageUrl: 'https://images.unsplash.com/photo-1607703703520-bb238e84498a?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '3',
    slug: 'deploying-ai-models-with-genkit',
    title: 'Deploying AI Models with Genkit',
    excerpt: 'Learn how to easily build, test, and deploy AI-powered features in your applications using Firebase Genkit. A practical introduction to the future of AI development.',
    content: 'Firebase Genkit is a powerful, open-source framework designed to simplify the process of building and deploying AI-powered applications. It provides a cohesive set of tools for creating complex AI flows that can call models like Gemini, manage prompts, and even call other services or APIs. With Genkit, you can define flows in TypeScript or Go, test them locally with a built-in UI, and then deploy them to Firebase Cloud Functions or other serverless environments. This makes it incredibly efficient to add sophisticated AI capabilities, like content generation or data analysis, to your apps.',
    createdAt: new Date('2024-07-20T09:00:00Z').toISOString(),
    tags: ['ai', 'firebase', 'genkit', 'genai'],
    imageUrl: 'https://images.unsplash.com/photo-1555949963-ff980877a24f?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '4',
    slug: 'deep-dive-into-tailwind-css',
    title: 'A Deep Dive into Tailwind CSS',
    excerpt: 'Discover the power of utility-first CSS with Tailwind. We will explore how it speeds up development and helps in creating consistent UIs.',
    content: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing any custom CSS. Instead of writing CSS rules, you apply pre-existing classes directly in your HTML. This approach promotes consistency, speeds up development, and helps keep your CSS bundle size small. We will cover configuration, responsive design, and best practices for building beautiful interfaces with Tailwind.',
    createdAt: new Date('2024-07-19T11:00:00Z').toISOString(),
    tags: ['css', 'tailwind', 'frontend', 'design'],
    imageUrl: 'https://images.unsplash.com/photo-1644261386522-f55964c9255a?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '5',
    slug: 'state-management-in-react-2024',
    title: 'State Management in React: A 2024 Showdown',
    excerpt: 'A comprehensive comparison of modern state management libraries for React, including Zustand, Redux Toolkit, and the built-in Context API.',
    content: 'Choosing the right state management solution is crucial for any React application. In this post, we compare the most popular options in 2024. We\'ll look at the simplicity of the Context API for smaller apps, the boilerplate reduction of Redux Toolkit for large-scale applications, and the minimalist approach of Zustand. We\'ll analyze their performance, learning curve, and when to use each one, helping you make an informed decision for your next project.',
    createdAt: new Date('2024-07-18T16:00:00Z').toISOString(),
    tags: ['react', 'state-management', 'zustand', 'redux'],
    imageUrl: 'https://images.unsplash.com/photo-1561883088-03a395e41526?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '6',
    slug: 'server-vs-client-components-nextjs',
    title: 'Server vs. Client Components in Next.js',
    excerpt: 'A practical guide to understanding the difference between Server and Client Components in Next.js and when to use each for optimal performance.',
    content: 'Next.js 13 introduced a new paradigm with Server and Client Components. Server Components run exclusively on the server, reducing the amount of JavaScript sent to the client and improving initial load times. Client Components are the traditional React components that run in the browser. This guide will walk you through the key differences, benefits, and patterns for using both types of components effectively to build fast, interactive, and dynamic web applications.',
    createdAt: new Date('2024-07-17T10:00:00Z').toISOString(),
    tags: ['nextjs', 'react', 'performance', 'server-components'],
    imageUrl: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '7',
    slug: 'getting-started-with-typescript-in-react',
    title: 'Getting Started with TypeScript in a React Project',
    excerpt: 'Learn the benefits of using TypeScript with React and how to set up your first project. Improve your code quality and catch errors early.',
    content: 'TypeScript adds static typing to JavaScript, which can be a game-changer for large React applications. By catching type errors at build time, you can prevent many common bugs from ever reaching production. This article covers the basics of adding TypeScript to a React project, defining types for props and state, and using generics to create reusable, type-safe components. Start writing more robust and maintainable React code today.',
    createdAt: new Date('2024-07-16T12:45:00Z').toISOString(),
    tags: ['typescript', 'react', 'frontend', 'best-practices'],
    imageUrl: 'https://images.unsplash.com/photo-1596495577886-d9250559524b?q=80&w=1280&h=720&auto=format&fit=crop'
  },
  {
    id: '8',
    slug: 'cicd-for-nextjs-applications',
    title: 'CI/CD for Next.js Applications',
    excerpt: 'A simple guide to setting up a Continuous Integration and Continuous Deployment (CI/CD) pipeline for your Next.js app using GitHub Actions.',
    content: 'Automating your deployment process is essential for modern web development. A CI/CD pipeline automatically builds, tests, and deploys your application whenever you push new code. This guide provides a step-by-step walkthrough of how to create a simple yet effective pipeline for a Next.js application using GitHub Actions. We will set up workflows to lint, build, and deploy your site to a hosting provider like Vercel or Firebase App Hosting, streamlining your development workflow.',
    createdAt: new Date('2024-07-15T08:30:00Z').toISOString(),
    tags: ['cicd', 'github-actions', 'nextjs', 'devops'],
    imageUrl: 'https://images.unsplash.com/photo-1580894732444-84cf4bde8408?q=80&w=1280&h=720&auto=format&fit=crop'
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
    imageUrl: `https://images.unsplash.com/photo-1517694712202-1428bc38559a?q=80&w=1280&h=720&auto=format&fit=crop`,
  };

  posts = [newPost, ...posts];
  
  revalidatePath('/');
  revalidatePath(`/posts/${newPost.slug}`);
  redirect(`/posts/${newPost.slug}`);
}
