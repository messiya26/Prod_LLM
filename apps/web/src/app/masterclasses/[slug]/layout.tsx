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

async function MasterclassJsonLd({ slug }: { slug: string }) {
  try {
    const res = await fetch(`${API_URL}/masterclasses/${slug}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const mc = await res.json();
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: mc.title,
      description: mc.description || "",
      url: `${BASE_URL}/masterclasses/${slug}`,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      organizer: { "@type": "Organization", name: "Lord Lombo Ministries", url: BASE_URL },
      performer: { "@type": "Person", name: "Lord Lombo" },
      ...(mc.thumbnail && { image: mc.thumbnail }),
      ...(mc.startDate && { startDate: mc.startDate }),
      ...(mc.endDate && { endDate: mc.endDate }),
      ...(mc.price !== undefined && {
        offers: {
          "@type": "Offer",
          price: mc.price || 0,
          priceCurrency: "USD",
          availability: mc.spotsLeft > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
        },
      }),
      location: { "@type": "VirtualLocation", url: `${BASE_URL}/masterclasses/${slug}` },
    };
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
  } catch {
    return null;
  }
}

export default function MasterclassSlugLayout({ children, params }: { children: React.ReactNode; params: { slug: string } }) {
  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <MasterclassJsonLd slug={params.slug} />
      {children}
    </>
  );
}
