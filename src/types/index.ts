export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  createdAt: string;
  tags: string[];
  comments: Comment[];
  imageUrl: string;
}
