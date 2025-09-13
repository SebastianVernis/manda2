# Protocolo para Actualizar la URL del Frontend

Este protocolo describe los pasos a seguir para actualizar la URL del frontend en la aplicación YEGA.

## Pasos

1.  **Actualizar el archivo de entorno del backend:**
    *   Edita el archivo `.env` en el directorio raíz del backend (`/home/ec2-user/.env`).
    *   Modifica la variable `FRONTEND_URL` para incluir los nuevos dominios permitidos.

2.  **Actualizar el archivo de entorno del frontend:**
    *   Edita el archivo `.env` en el directorio del frontend (`/home/ec2-user/yega-backup/frontend/.env`).
    *   Modifica la variable `VITE_API_URL` para que apunte a la nueva URL de la API.

3.  **Actualizar el script de reconstrucción:**
    *   Edita el script `rebuild_frontend.sh` en el directorio raíz (`/home/ec2-user/rebuild_frontend.sh`).
    *   Modifica la variable `API_URL` para que apunte a la nueva URL de la API.

4.  **Reconstruir el frontend:**
    *   Ejecuta el script `rebuild_frontend.sh` para reconstruir la aplicación de frontend con la nueva configuración:
        ```bash
        bash /home/ec2-user/rebuild_frontend.sh
        ```

5.  **Reiniciar el servidor de la API:**
    *   Reinicia el servidor de la API de YEGA para que los cambios en el archivo `.env` del backend surtan efecto:
        ```bash
        pm2 restart yega --update-env
        ```

6.  **Actualizar el control de versiones:**
    *   Añade los archivos modificados al repositorio de git, haz commit y sube los cambios al repositorio remoto para asegurar la consistencia del código.
    *   Asegúrate de que los siguientes archivos estén actualizados en el repositorio de `yega-backup`:
        *   `frontend/.env`
        *   `rebuild_frontend.sh`
