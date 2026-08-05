import type { BlogPost } from '@/data/blog';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function getApiPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${API_BASE}/blog`);
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getApiPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`);
  if (!res.ok) return null;
  return (await res.json()) as BlogPost;
}
