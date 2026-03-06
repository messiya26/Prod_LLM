import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://prod-llm.onrender.com/api/v1";
const BASE_URL = "https://lordlomboministries.com";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/masterclasses/${params.slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: "Masterclass | Lord Lombo Ministries" };
    const mc = await res.json();
    return {
      title: `${mc.title} | Masterclass Lord Lombo`,
      description: mc.description?.substring(0, 160) || `Masterclass exclusive ${mc.title} avec le Pasteur Lord Lombo.`,
      openGraph: {
        title: mc.title,
        description: mc.description?.substring(0, 200),
        url: `${BASE_URL}/masterclasses/${params.slug}`,
        type: "website",
        images: mc.thumbnail ? [{ url: mc.thumbnail, width: 800, height: 450 }] : [],
      },
    };
  } catch {
    return { title: "Masterclass | Lord Lombo Ministries" };
  }
}

export default function MasterclassSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
