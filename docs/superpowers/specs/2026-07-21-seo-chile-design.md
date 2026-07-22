# SEO Chile — Landing + páginas de solución

> Design doc aprobado en brainstorming. Fecha: 2026-07-21.
> Objetivo: posicionar SIMCII en Google Chile para búsquedas de **categoría/producto** (ej: "plataforma de monitoreo ambiental Chile", "software relacionamiento comunitario").

## Contexto

- Sitio actual: landing SPA de una sola URL (`https://simcii.ai/`), HTML estático + React UMD con JSX precompilado (`npm run build`), Three.js y Mapbox, hosteado en Vercel.
- Base on-page ya existente: title, meta description, Open Graph, Twitter cards, JSON-LD (Organization + SoftwareApplication), canonical, robots.txt, sitemap.xml.
- Problema: solo ~96 palabras de contenido rastreable (en `<noscript>`); todo el contenido real se renderiza client-side. Una sola URL no puede rankear por múltiples búsquedas de categoría.
- Google Search Console: configurado y verificado.
- Decisión de enfoque (Opción A): páginas HTML estáticas artesanales con el stack actual. Sin migración de framework, sin generador markdown. Si a futuro se agrega sección de guías/recursos, se re-evalúa (Astro o mini-SSG).

## 1. Mapa de páginas → búsquedas objetivo

7 páginas nuevas, HTML estático puro.

### Soluciones (`/soluciones/`)

| URL limpia | Archivo | Búsqueda objetivo principal |
|---|---|---|
| `/soluciones/monitoreo-ambiental` | `soluciones/monitoreo-ambiental.html` | plataforma de monitoreo ambiental Chile · software monitoreo ambiental |
| `/soluciones/relacionamiento-comunitario` | `soluciones/relacionamiento-comunitario.html` | software relacionamiento comunitario · gestión de stakeholders |
| `/soluciones/cumplimiento-rca` | `soluciones/cumplimiento-rca.html` | software cumplimiento RCA · seguimiento compromisos ambientales |
| `/soluciones/gestion-territorial` | `soluciones/gestion-territorial.html` | plataforma gestión territorial · inteligencia territorial |

### Industrias (`/industrias/`)

| URL limpia | Archivo | Búsqueda objetivo principal |
|---|---|---|
| `/industrias/mineria` | `industrias/mineria.html` | monitoreo ambiental minería · relacionamiento comunitario minería |
| `/industrias/energia` | `industrias/energia.html` | monitoreo ambiental proyectos de energía renovable |
| `/industrias/sector-publico` | `industrias/sector-publico.html` | plataforma monitoreo territorial sector público |

## 2. Plantilla de página de solución/industria

Cada página es HTML estático **sin React, Three.js ni Mapbox** (carga rápida, Core Web Vitals altos). Comparte:

- CSS y tokens del manual de marca "Cordillera Cívica" (mismo dark institucional, Manrope/Source Sans 3/JetBrains Mono). El CSS de la landing se extrae a un archivo compartido si hoy está inline, o se referencia el existente.
- Header con logo + nav (enlaces a landing, soluciones, industrias, CTA demo) y footer consistentes con la landing. Separadores con la silueta SVG de la cordillera (sin 3D).

Contenido por página (~800–1.200 palabras, tono "autoridad tranquila" de DESIGN.md — evidencia, sin hype, sin jerga de IA):

1. `<h1>` con la keyword objetivo natural (ej: "Plataforma de monitoreo ambiental para operaciones en Chile").
2. Intro: el problema que resuelve y para quién.
3. Qué hace SIMCII en ese dominio (parámetros, scores 0–100, alertas, compromisos — según KNOWLEDGE_BASE).
4. Cómo se ve en la operación (referencia a screenshots reales si existen en `assets/`).
5. FAQ: 3–5 preguntas reales de compradores, con schema `FAQPage`.
6. CTA: solicitar demo (mismo mecanismo de contacto actual).
7. Enlaces cruzados: soluciones ↔ industrias relacionadas ↔ landing.

Head por página: title único (≤60 car., keyword + "Chile" + SIMCII), meta description única (≤155 car.), canonical a la URL limpia, Open Graph, JSON-LD `Service` (con `provider` → `https://simcii.ai/#organization`) + `FAQPage` para la sección de preguntas.

## 3. Cambios a la landing (`SIMCII.html`)

- Reemplazar el `<noscript>` por **contenido estático real dentro de `#root`**: los textos clave de la landing (hero, qué hace, para quién) en HTML semántico que React reemplaza al hidratar. Sin cambio visual para usuarios con JS; Google indexa el contenido completo.
- Agregar bloque de enlaces a las 7 páginas nuevas en nav y/o footer (interlinking para descubrimiento y transferencia de autoridad). Requiere tocar los JSX de nav/footer y recompilar.
- Title y meta description: incluir "Chile" explícito (hoy solo en `og:locale`).

## 4. Infraestructura

- `vercel.json`: rewrites `/soluciones/:page` → `/soluciones/:page.html` y `/industrias/:page` → `/industrias/:page.html` (además del rewrite raíz existente).
- `sitemap.xml`: las 8 URLs con `<lastmod>` reales.
- `robots.txt`: sin cambios (ya permite todo salvo `/api/`).
- Build: `npm run build` actual sin cambios; las páginas nuevas no requieren compilación.

## 5. Medición y criterio de éxito

- Enviar sitemap actualizado en GSC y solicitar indexación de las 7 URLs nuevas.
- Revisión a las 2–4 semanas: qué queries generan impresiones por página; iterar titles/contenido según datos.
- Expectativa: primeras impresiones en 2–6 semanas; posiciones estables en 2–4 meses (nicho de baja competencia en Chile).
- Éxito = las páginas de solución aparecen en top 10 de Google Chile para sus búsquedas objetivo y generan solicitudes de demo.

## Fuera de alcance

- Sección de blog/recursos con publicación periódica.
- Migración a framework (Astro/Next.js).
- Campañas pagadas, link building activo, quiz/lead magnets.
- Versiones en otros idiomas (sitio solo es-CL; no requiere hreflang).

## Errores y riesgos

- **Riesgo de inconsistencia visual**: las páginas nuevas comparten CSS real de la landing, no una copia. Si el CSS está embebido en `SIMCII.html`, primero se extrae a `assets/` y la landing lo referencia.
- **Contenido duplicado**: cada página se escribe desde cero con foco distinto; no se clona texto entre páginas (Google penaliza plantillas con texto repetido).
- **Hidratación**: el contenido estático en `#root` debe ser reemplazado limpiamente por React (`createRoot(...).render()` ya reemplaza el contenido; verificar que no haya flash visual).
