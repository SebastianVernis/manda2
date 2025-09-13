# Protocolo de Fallback para la Aplicación YEGA

Este documento describe los pasos a seguir en caso de que la aplicación YEGA experimente un fallo o no cargue correctamente. Incluye procedimientos de diagnóstico, reinicio rápido, restauración desde un backup y un reseteo completo como último recurso.

## 1. Diagnóstico Inicial

Cuando la aplicación no funcione, sigue estos pasos para obtener información inicial:

1.  **Verificar el estado de PM2:**
    ```bash
    pm2 show yega
    ```
    Asegúrate de que el `status` sea `online`. Si es `errored` o `stopped`, la aplicación no está corriendo.

2.  **Revisar los logs de la aplicación:**
    ```bash
    pm2 logs yega --lines 50
    ```
    Busca mensajes de error (`Error:`, `SyntaxError:`, `MODULE_NOT_FOUND`, etc.) en la sección `yega-error.log`. Esto es crucial para entender la causa del fallo.

3.  **Verificar el estado de Caddy (si usas HTTPS):**
    ```bash
    sudo caddy status
    ```
    Asegúrate de que Caddy esté `active (running)`. Si no, podría ser un problema con el proxy inverso.

4.  **Revisar los logs de Caddy (si usas HTTPS):**
    ```bash
    sudo journalctl -u caddy --since "1 hour ago" | tail -n 50
    ```
    Busca errores relacionados con la conexión al backend (`reverse_proxy`) o problemas con los certificados SSL.

## 2. Reinicio Rápido (Primer Intento de Solución)

Si la aplicación está en estado `errored` o `stopped` y los logs no muestran un error obvio y persistente, intenta un reinicio rápido:

```bash
pm2 reload yega
```

Después de unos segundos, verifica el estado y los logs nuevamente (`pm2 show yega`, `pm2 logs yega --lines 50`). Si el problema persiste, pasa a la siguiente sección.

## 3. Restauración desde Backup (Recomendado para Fallos Persistentes)

Si el reinicio rápido no funciona o los logs indican un problema recurrente (como `MODULE_NOT_FOUND` o errores de sintaxis que reaparecen), puedes restaurar la aplicación a un estado de funcionamiento conocido utilizando el backup `yega_working_state_backup.tar.gz`.

1.  **Detener la aplicación y Caddy:**
    ```bash
    pm2 stop all
    sudo caddy stop
    ```

2.  **Eliminar los directorios actuales de la aplicación (¡PRECAUCIÓN: Esto eliminará los archivos actuales!):**
    ```bash
    sudo rm -rf /var/www/yega/backend
    sudo rm -rf /var/www/yega/frontend
    ```

3.  **Restaurar los archivos desde el backup:**
    ```bash
    sudo mkdir -p /var/www/yega
    sudo tar -xzf /home/ec2-user/yega_working_state_backup.tar.gz -C /var/www/yega/
    # Mover los contenidos restaurados a sus ubicaciones finales
    sudo mv /var/www/yega/backend /var/www/yega/
    sudo mv /var/www/yega/frontend /var/www/yega/
    sudo mv /var/www/yega/ecosystem.config.js /home/ec2-user/
    sudo mv /var/www/yega/Caddyfile /home/ec2-user/
    ```
    **Nota**: Es posible que necesites ajustar las rutas si tu backup se extrae en un subdirectorio diferente.

4.  **Reinstalar dependencias del backend (por si acaso):**
    ```bash
    cd /var/www/yega/backend
    sudo npm install
    ```

5.  **Reconstruir el frontend (por si acaso):**
    ```bash
    cd /var/www/yega/frontend
    sudo npm install
    sudo npm run build
    ```

6.  **Reiniciar PM2 y Caddy:**
    ```bash
    pm2 delete all # Asegura que no haya definiciones de procesos antiguas
    pm2 start /home/ec2-user/ecosystem.config.js --env production
    pm2 save
    sudo caddy start --config /home/ec2-user/Caddyfile
    ```

7.  **Verificar la aplicación:**
    Repite los pasos de la Sección 1 (Diagnóstico Inicial) y luego accede a la aplicación en tu navegador (`https://yega.YOUR_PUBLIC_IP.nip.io`).

## 4. Reseteo Completo (Último Recurso)

Si la restauración desde el backup no resuelve el problema, o si prefieres empezar de cero, puedes seguir el protocolo de reseteo completo y re-despliegue detallado en el archivo `deployment_instructions.md`.

Este proceso implica eliminar todas las configuraciones y archivos de la aplicación y volver a desplegarla desde cero.

---
**Ubicación del Backup:** `/home/ec2-user/yega_working_state_backup.tar.gz`
**IP Pública Actual:** `$(curl -s ifconfig.me)`
---
