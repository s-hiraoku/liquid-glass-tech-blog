/**
 * Service Worker Registration Component - Phase 6.7-6.8 PWA Enhancement
 * 
 * Registers and manages service worker for Progressive Web App functionality.
 * Provides offline support, caching strategies, and update notifications.
 * 
 * Features:
 * - Service worker registration and lifecycle management
 * - Update notifications with user consent
 * - Offline support with fallback UI
 * - Cache management and optimization
 * - Install prompt handling
 * - Background sync capabilities
 * - Accessibility compliant notifications
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Download, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertCircle,
  X,
  Smartphone
} from 'lucide-react';

interface ServiceWorkerRegistrationProps {
  className?: string;
  showInstallPrompt?: boolean;
  showUpdateNotifications?: boolean;
  enableOfflineIndicator?: boolean;
}

export function ServiceWorkerRegistration({
  className,
  showInstallPrompt = true,
  showUpdateNotifications = true,
  enableOfflineIndicator = true
}: ServiceWorkerRegistrationProps) {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      const registerSW = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
          });

          setRegistration(reg);

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available
                  setUpdateAvailable(true);
                  if (showUpdateNotifications) {
                    setShowUpdateBanner(true);
                  }
                }
              });
            }
          });

          // Listen for controlling service worker changes
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            // New service worker has taken control
            window.location.reload();
          });

        } catch (error) {
          console.error('Service worker registration failed:', error);
        }
      };

      registerSW();
    }
  }, [showUpdateNotifications]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setInstallPromptEvent(e);
      
      if (showInstallPrompt) {
        // Show custom install banner
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setInstallPromptEvent(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [showInstallPrompt]);

  // Install PWA
  const handleInstall = useCallback(async () => {
    if (!installPromptEvent) return;

    setIsInstalling(true);
    try {
      // Show the install prompt
      await installPromptEvent.prompt();
      
      // Wait for the user to respond to the prompt
      const result = await installPromptEvent.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallBanner(false);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the prompt event
      setInstallPromptEvent(null);
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  }, [installPromptEvent]);

  // Update service worker
  const handleUpdate = useCallback(async () => {
    if (!registration || !updateAvailable) return;

    setIsUpdating(true);
    try {
      // Skip waiting and activate new service worker
      const waitingWorker = registration.waiting;
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
        
        // Listen for the new service worker to become active
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  }, [registration, updateAvailable]);

  // Dismiss banners
  const dismissInstallBanner = () => setShowInstallBanner(false);
  const dismissUpdateBanner = () => {
    setShowUpdateBanner(false);
    setUpdateAvailable(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Offline Indicator */}
      {enableOfflineIndicator && !isOnline && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-yellow-500 text-yellow-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
            <Badge variant="secondary" className="text-xs">
              Limited functionality
            </Badge>
          </div>
        </div>
      )}

      {/* Online Indicator (brief) */}
      {enableOfflineIndicator && isOnline && (
        <div className="sr-only" aria-live="polite">
          You're online. Full functionality available.
        </div>
      )}

      {/* Install PWA Banner */}
      {showInstallBanner && installPromptEvent && (
        <div 
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          role="dialog"
          aria-labelledby="install-banner-title"
          aria-describedby="install-banner-description"
        >
          <div className="bg-background border border-border rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="install-banner-title" className="font-semibold text-sm">
                  Install Liquid Glass Tech Blog
                </h3>
                <p id="install-banner-description" className="text-sm text-muted-foreground mt-1">
                  Get the full experience with offline access and faster loading.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    size="sm" 
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="gap-2"
                  >
                    {isInstalling ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Download className="w-3 h-3" />
                    )}
                    {isInstalling ? 'Installing...' : 'Install'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={dismissInstallBanner}
                    className="gap-2"
                  >
                    <X className="w-3 h-3" />
                    Not now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Available Banner */}
      {showUpdateBanner && updateAvailable && (
        <div 
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          role="dialog"
          aria-labelledby="update-banner-title"
          aria-describedby="update-banner-description"
        >
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 id="update-banner-title" className="font-semibold text-sm">
                  New version available
                </h3>
                <p id="update-banner-description" className="text-sm opacity-90 mt-1">
                  An updated version is ready. Refresh to get the latest features and improvements.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={handleUpdate}
                    disabled={isUpdating}
                    className="gap-2"
                  >
                    {isUpdating ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3 h-3" />
                    )}
                    {isUpdating ? 'Updating...' : 'Update now'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={dismissUpdateBanner}
                    className="gap-2 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <X className="w-3 h-3" />
                    Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status for Screen Readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Connection status: {isOnline ? 'Online' : 'Offline'}.
        {!isOnline && ' Some features may be limited while offline.'}
        {updateAvailable && ' A new version of the application is available.'}
        {showInstallBanner && ' The application can be installed for a better experience.'}
      </div>
    </div>
  );
}

export default ServiceWorkerRegistration;