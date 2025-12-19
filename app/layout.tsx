import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    default: 'Mogols - 100% Organic & Pure Natural Products',
    template: '%s | Mogols'
  },
  description: 'Discover nature\'s finest gifts at Mogols. Authentic honey, fresh fruits, organic oils, and nutritious seeds delivered straight to your doorstep. 100% organic and pure.',
  keywords: ['organic products', 'natural products', 'honey', 'organic oil', 'fresh fruits', 'seeds', 'healthy food', 'bangladesh organic'],
  authors: [{ name: 'Mogols' }],
  creator: 'Mogols',
  publisher: 'Mogols',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Mogols - 100% Organic & Pure Natural Products',
    description: 'Authentic honey, fresh fruits, organic oils, and nutritious seeds. 100% organic and pure products delivered to your doorstep.',
    url: '/',
    siteName: 'Mogols',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mogols - Organic Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mogols - 100% Organic & Pure Natural Products',
    description: 'Authentic honey, fresh fruits, organic oils, and nutritious seeds. 100% organic and pure.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { Providers } from "../components/Providers";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mogols',
    description: 'Authentic honey, fresh fruits, organic oils, and nutritious seeds. 100% organic and pure.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English', 'Bengali'],
    },
    sameAs: [
      'https://facebook.com/mogols',
      'https://twitter.com/mogols',
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
