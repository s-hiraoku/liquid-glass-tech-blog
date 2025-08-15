/**
 * Client Providers - Phase 6.7-6.8 Client-Side Enhancements
 * 
 * Wraps client-side components that require browser APIs.
 * Handles dynamic imports with SSR: false for browser-only features.
 */

'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for client-only components
const PerformanceMonitor = dynamic(() => import('@/components/performance/PerformanceMonitor'), {
  ssr: false,
  loading: () => null
});

const ServiceWorkerRegistration = dynamic(() => import('@/components/pwa/ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null
});

interface ClientProvidersProps {
  children: React.ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      {children}
      
      {/* Performance monitoring (development/staging only) */}
      {process.env.NODE_ENV !== 'production' && (
        <Suspense fallback={null}>
          <PerformanceMonitor />
        </Suspense>
      )}
      
      {/* Service Worker registration for PWA functionality */}
      <Suspense fallback={null}>
        <ServiceWorkerRegistration />
      </Suspense>
    </>
  );
}

export default ClientProviders;