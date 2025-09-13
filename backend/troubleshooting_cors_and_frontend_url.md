# Solución de problemas de CORS y URL de frontend

## Problema

El frontend de la aplicación estaba haciendo peticiones a una URL de API incorrecta, lo que causaba errores de CORS. El backend no permitía peticiones desde el dominio antiguo.

## Causa Raíz

La causa del problema era doble:

1.  **URL de API incorrecta en el frontend:** El archivo de entorno del frontend (`frontend/.env`) contenía una URL de API antigua y hardcodeada que apuntaba a una dirección IP en lugar del dominio `yega.com.mx`.
2.  **Script de reconstrucción obsoleto:** El script `rebuild_frontend.sh` también contenía la URL de API antigua y hardcodeada, por lo que cada vez que se reconstruía el frontend, se volvía a introducir la URL incorrecta.

## Solución

La solución consistió en los siguientes pasos:

1.  **Actualizar el archivo de entorno del frontend:** Se modificó el archivo `/home/ec2-user/yega-backup/frontend/.env` para que la variable `VITE_API_URL` apuntara a la URL correcta de la API: `https://yega.com.mx/api`.

2.  **Actualizar el script de reconstrucción:** Se modificó el script `/home/ec2-user/rebuild_frontend.sh` para que la variable `API_URL` apuntara a la URL correcta de la API: `https://yega.com.mx/api`.

3.  **Reconstruir el frontend:** Se ejecutó el script `rebuild_frontend.sh` para reconstruir la aplicación de frontend con la nueva configuración.

4.  **Actualizar el control de versiones:** Se añadieron los archivos modificados al repositorio de git, se hizo commit y se subieron los cambios al repositorio remoto para asegurar la consistencia del código.
