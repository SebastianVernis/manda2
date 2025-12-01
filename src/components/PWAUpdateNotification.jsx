import React, { useEffect, useState } from 'react';
import { Alert, Button } from 'react-bootstrap';
import useServiceWorker from '../hooks/useServiceWorker';

const PWAUpdateNotification = () => {
  const { 
    updateAvailable, 
    updateServiceWorker, 
    isOnline,
    requestNotificationPermission 
  } = useServiceWorker();

  React.useEffect(() => {
    // Request notification permission on mount
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  if (!updateAvailable) return null;

  return (
    <Alert 
      variant="info" 
      className="position-fixed top-0 start-50 translate-middle-x mt-3" 
      style={{ zIndex: 9999, maxWidth: '400px' }}
    >
      <Alert.Heading className="h6 mb-2">
        🔄 Nueva versión disponible
      </Alert.Heading>
      <p className="mb-3 small">
        Hay una actualización disponible. ¿Quieres instalarla ahora?
      </p>
      <div className="d-flex gap-2">
        <Button 
          size="sm" 
          variant="primary"
          onClick={updateServiceWorker}
        >
          Actualizar
        </Button>
        <Button 
          size="sm" 
          variant="outline-secondary"
          onClick={() => window.location.reload()}
        >
          Más tarde
        </Button>
      </div>
    </Alert>
  );
};

// Offline indicator component
export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null;

  return (
    <Alert 
      variant="warning" 
      className="position-fixed bottom-0 start-50 translate-middle-x mb-3" 
      style={{ zIndex: 9999, maxWidth: '300px' }}
    >
      <div className="d-flex align-items-center gap-2">
        <span className="text-warning">⚠️</span>
        <small>Sin conexión a internet</small>
      </div>
    </Alert>
  );
};

export default PWAUpdateNotification;