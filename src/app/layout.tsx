import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

// Fonts
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Liquid Glass Tech Blog",
    template: "%s | Liquid Glass Tech Blog",
  },
  description: "Discover the art of modern web development with liquid glass effects, seasonal theming, and performance-optimized animations.",
  keywords: ["liquid glass", "glassmorphism", "web development", "React", "Next.js", "TypeScript", "modern web design"],
  authors: [{ name: "Liquid Glass Tech Team" }],
  creator: "Liquid Glass Tech Blog",
  publisher: "Liquid Glass Tech Blog",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://liquid-glass-tech-blog.vercel.app",
    siteName: "Liquid Glass Tech Blog",
    title: "Liquid Glass Tech Blog",
    description: "Discover the art of modern web development with liquid glass effects, seasonal theming, and performance-optimized animations.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Liquid Glass Tech Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liquid Glass Tech Blog",
    description: "Discover the art of modern web development with liquid glass effects, seasonal theming, and performance-optimized animations.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen bg-background font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}