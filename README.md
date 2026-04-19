# simcii-web-test

## Variables de entorno

Configura esta variable en Vercel antes de desplegar:

- `MAPBOX_TOKEN`: token público de Mapbox usado para renderizar el mapa.

El token ya no está hardcodeado en los archivos del sitio. En producción el cliente lo obtiene desde `/api/config`, que lee `process.env.MAPBOX_TOKEN` en Vercel.
