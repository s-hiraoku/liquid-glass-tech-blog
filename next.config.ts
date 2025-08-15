import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Configure MDX support
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  
  // Performance optimizations
  experimental: {
    // Enable App Router optimizations
    optimizePackageImports: ["framer-motion", "@mdx-js/react"],
    
    // Enable partial prerendering for better performance
    ppr: false, // Disable for now until stable
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https", 
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Security headers
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: https://res.cloudinary.com https://images.unsplash.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.openweathermap.org https://vitals.vercel-analytics.com",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options", 
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // Simplified webpack config for development
  webpack: (config, { dev, isServer }) => {
    // Minimal config to avoid optimization conflicts
    return config;
  },

  // Enable static exports for better performance 
  output: "standalone",
  
  // Experimental features for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

// Wrap with MDX plugin
const withMDX = createMDX({
  // Add markdown plugins here
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
