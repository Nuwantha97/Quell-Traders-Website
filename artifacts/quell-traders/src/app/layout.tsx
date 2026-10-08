import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  applicationName: site.name,
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f7fafc",
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.description,
  telephone: site.phone,
  email: site.emails,
  founder: {
    "@type": "Person",
    name: site.founder,
    jobTitle: site.role,
  },
  address: {
    "@type": "PostalAddress",
    ...site.postalAddress,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
