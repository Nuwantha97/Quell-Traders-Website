import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans, JetBrains_Mono } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

// Self-hosted at build time with next/font/google
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["500", "600"],
});

const NEXT_PUBLIC_SITE_URL = "https://quell-traders-website.vercel.app/";

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  applicationName: site.name,
  ...(NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(NEXT_PUBLIC_SITE_URL) }
    : {}),
  icons: {
    icon: "/icon.png",
  },
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
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
