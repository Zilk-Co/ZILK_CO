import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'rlnj2yx2',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-07-24',
  token: import.meta.env.VITE_SANITY_TOKEN || '',
  useCdn: true,
});

export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: any[];
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
}

export async function getPosts(): Promise<SanityPost[]> {
  return sanityClient.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    content,
    category,
    readTime,
    publishedAt,
    author->{name, role}
  }`);
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  return sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    category,
    readTime,
    publishedAt,
    author->{name, role}
  }`, { slug });
}
