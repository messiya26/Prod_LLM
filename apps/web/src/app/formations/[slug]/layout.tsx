import type { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://prod-llm.onrender.com/api/v1";
const BASE_URL = "https://lordlomboministries.com";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/courses/${params.slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return { title: "Formation | Lord Lombo Ministries" };
    const course = await res.json();
    return {
      title: `${course.title} | Formation Lord Lombo Academie`,
      description: course.description?.substring(0, 160) || `Formation ${course.title} par Lord Lombo Academie. Inscrivez-vous maintenant.`,
      keywords: [course.title, course.category, "formation en ligne", "Lord Lombo", "cours certifiant"].filter(Boolean),
      openGraph: {
        title: course.title,
        description: course.description?.substring(0, 200),
        url: `${BASE_URL}/formations/${params.slug}`,
        type: "website",
        images: course.thumbnail ? [{ url: course.thumbnail, width: 800, height: 450 }] : [],
      },
    };
  } catch {
    return { title: "Formation | Lord Lombo Ministries" };
  }
}

export default function FormationSlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
