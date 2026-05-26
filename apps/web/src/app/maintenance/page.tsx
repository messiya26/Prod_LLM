import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indisponible",
  description: "",
  robots: { index: false, follow: false, nocache: true, noarchive: true, nosnippet: true },
};

export default function MaintenancePage() {
  return (
    <html lang="fr">
      <head>
        <meta name="robots" content="noindex,nofollow,noarchive,nosnippet" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0a0a0f",
          fontFamily: "'Segoe UI', Tahoma, Geneva, sans-serif",
          color: "#e5e5e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 600,
              margin: "0 0 12px",
              color: "#f5f5f5",
              letterSpacing: 0.5,
            }}
          >
            Service indisponible
          </h1>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "rgba(229,229,229,0.55)",
              margin: 0,
            }}
          >
            Cette ressource n&apos;est pas accessible.
          </p>
        </div>
      </body>
    </html>
  );
}
