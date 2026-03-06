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

async function CourseJsonLd({ slug }: { slug: string }) {
  try {
    const res = await fetch(`${API_URL}/courses/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const c = await res.json();
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Course",
      name: c.title,
      description: c.description || "",
      url: `${BASE_URL}/formations/${slug}`,
      provider: {
        "@type": "Organization",
        name: "Lord Lombo Ministries - Academie",
        url: BASE_URL,
      },
      ...(c.instructor && { instructor: { "@type": "Person", name: c.instructor } }),
      ...(c.thumbnail && { image: c.thumbnail }),
      ...(c.price !== undefined && {
        offers: {
          "@type": "Offer",
          price: c.price || 0,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE_URL}/formations/${slug}`,
        },
      }),
      ...(c.category && { courseCode: c.category }),
      inLanguage: "fr",
      isAccessibleForFree: c.price === 0 || c.price === "0",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: c.duration || "PT10H",
      },
    };
    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    );
  } catch {
    return null;
  }
}

export default function FormationSlugLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <CourseJsonLd slug={params.slug} />
      {children}
    </>
  );
}
