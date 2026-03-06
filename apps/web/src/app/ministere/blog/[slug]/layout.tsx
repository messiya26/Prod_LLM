import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://prod-llm.onrender.com/api/v1";
const BASE_URL = "https://lordlomboministries.com";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/blog/${params.slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: "Blog | Lord Lombo Ministries" };
    const post = await res.json();
    return {
      title: `${post.title} | Blog Lord Lombo Ministries`,
      description: post.excerpt?.substring(0, 160) || post.content?.substring(0, 160),
      openGraph: {
        title: post.title,
        description: post.excerpt?.substring(0, 200),
        url: `${BASE_URL}/ministere/blog/${params.slug}`,
        type: "article",
        publishedTime: post.createdAt,
        images: post.coverImage ? [{ url: post.coverImage, width: 800, height: 450 }] : [],
      },
    };
  } catch {
    return { title: "Blog | Lord Lombo Ministries" };
  }
}

export default function BlogSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
