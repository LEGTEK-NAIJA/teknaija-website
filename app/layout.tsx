import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://teknaija.legtek.ng";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TEK NAIJA — We build the systems Nigeria runs on.",
    template: "%s — TEK NAIJA",
  },
  description:
    "A Lagos-headquartered technology firm holding a portfolio of owned software (LEGTEK NAIJA, LITIGATEIQ) and building software for Nigerian institutions that need it built. RC 9181824.",
  applicationName: "TEK NAIJA",
  authors: [{ name: "TEK NAIJA LTD", url: SITE_URL }],
  creator: "TEK NAIJA LTD",
  publisher: "TEK NAIJA LTD",
  keywords: [
    "TEK NAIJA",
    "Nigerian technology holding company",
    "LEGTEK NAIJA",
    "STK Industries",
    "NILIS",
    "dispute resolution infrastructure",
    "software development Lagos",
    "RC 9181824",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: "TEK NAIJA",
    title: "TEK NAIJA — We build the systems Nigeria runs on.",
    description:
      "A Lagos-headquartered technology firm holding a portfolio of owned software (LEGTEK NAIJA, LITIGATEIQ) and building software for Nigerian institutions that need it built.",
    images: [
      {
        url: `${SITE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: "TEK NAIJA — We build the systems Nigeria runs on.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TEK NAIJA — We build the systems Nigeria runs on.",
    description:
      "Lagos-headquartered technology firm. Portfolio of owned software, plus engineering for Nigerian institutions.",
    images: [`${SITE_URL}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
  category: "technology",
  verification: {
    google: "YUrYtCYe5SsTIi7ASgb65zjC9aYteuluKlw6uYhFC50",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B0E1A" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0E1A" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TEK NAIJA LTD",
  legalName: "TEK NAIJA LTD",
  alternateName: "TEK NAIJA",
  url: SITE_URL,
  logo: `${SITE_URL}/tek-naija-logo-clean.png`,
  foundingDate: "2026-01-08",
  identifier: "RC 9181824",
  description:
    "Nigerian technology firm. Holds a portfolio of owned software (LEGTEK NAIJA, LITIGATEIQ) and builds software for Nigerian institutions — courts, exporters, chambers, and trading houses.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5 Bauchi Link Street",
    addressLocality: "Apapa, Lagos",
    addressRegion: "Lagos State",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "general enquiries",
    email: "hello@teknaija.ng",
    telephone: "+234-803-044-0935",
    areaServed: "NG",
    availableLanguage: ["English"],
  },
} as const;

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "TEK NAIJA",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "TEK NAIJA LTD",
    identifier: "RC 9181824",
  },
  inLanguage: "en-NG",
} as const;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-NG"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-build={process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local"}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
