# simcii-web-test

## Variables de entorno

Configura esta variable en Vercel antes de desplegar:

- `MAPBOX_TOKEN`: token público de Mapbox usado para renderizar el mapa.

El token ya no está hardcodeado en los archivos del sitio. En producción el cliente lo obtiene desde `/api/config`, que lee `process.env.MAPBOX_TOKEN` en Vercel.

El formulario (`/api/contact`) envía con Amazon SES desde `no-reply@accionet.cl` (dominio verificado, us-east-1). Sin `CONTACT_TO_EMAIL` va a cristian, juanandres y juanpablo @accionet.net; mientras se prueba, `CONTACT_TO_EMAIL` en Vercel (Production y Preview) lo deja sólo en cristian@accionet.net. No hay llaves guardadas: la función asume el rol IAM `simcii-web-contacto-ses` con el token OIDC de Vercel. El remitente se cambia con `CONTACT_FROM_EMAIL`.

## Diseño

El sitio usa la marca «Testigo» (Dirección B). Detalle de diseño y cómo regenerar el mapa 3D (Blender), el video de fondo (Remotion) y la imagen para redes en `DESIGN.md`.
