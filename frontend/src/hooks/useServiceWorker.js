import { useState, useEffect } from 'react';

const useServiceWorker = () => {
  const [swRegistration, setSwRegistration] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('✅ Service Worker registered successfully:', registration);
      
      setSwRegistration(registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('🔄 New service worker version available');
            setUpdateAvailable(true);
          }
        });
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Message from service worker:', event.data);
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  };

  const updateServiceWorker = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('🔔 Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  };

  const subscribeToPushNotifications = async () => {
    if (!swRegistration) {
      console.warn('⚠️ Service worker not registered yet');
      return null;
    }

    try {
      const subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'YOUR_VAPID_PUBLIC_KEY_HERE' // Replace with actual VAPID key
        )
      });
      
      console.log('✅ Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Push subscription failed:', error);
      return null;
    }
  };

  const syncInBackground = (tag) => {
    if (swRegistration && 'sync' in swRegistration) {
      return swRegistration.sync.register(tag);
    }
    return Promise.reject('Background sync not supported');
  };

  return {
    swRegistration,
    isOnline,
    updateAvailable,
    updateServiceWorker,
    requestNotificationPermission,
    subscribeToPushNotifications,
    syncInBackground
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default useServiceWorker;