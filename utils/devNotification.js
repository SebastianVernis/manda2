// Utilidad para mostrar notificaciones en desarrollo
const devNotification = {
  show: (message, type = 'info') => {
    const colors = {
      info: '\x1b[36m%s\x1b[0m',    // Cyan
      success: '\x1b[32m%s\x1b[0m',  // Verde
      warning: '\x1b[33m%s\x1b[0m',  // Amarillo
      error: '\x1b[31m%s\x1b[0m'     // Rojo
    };

    const prefix = '🔔 [DEV NOTIFICATION]';
    console.log(colors[type], `${prefix} ${message}`);

    // Si estamos en producción, también enviar a un servicio de logging
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implementar logging service
    }

    return { success: true, message };
  }
};

module.exports = devNotification;