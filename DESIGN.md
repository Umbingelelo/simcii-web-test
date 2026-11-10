# DESIGN.md — SIMCII landing

> Fuente de verdad del diseño. El CSS, los tokens y los componentes son proyecciones de este archivo. Si divergen, gana DESIGN.md.
> Base: **Manual de Marca SIMCII v3.0 "Cordillera Cívica"** (mayo 2026) + skill `frontend-design-deslop`.
> Última actualización: 2026-11-10.

## v6 · Dirección B «Testigo» (en producción, `/`)

Rediseño del sitio con la marca provisional de `Documentacion/SIMCII/01-marca` (hito 2). **El contenido es el de producción** (textos, secciones, muestra funcional, mapa, FAQ, formulario); cambia sólo la forma. Home: `index.html` + `assets/site.css` + `assets/site.js`. Subpáginas (`soluciones/`, `industrias/`): mismo HTML de antes con `assets/sub.css` en la marca nueva.

- **Color (tema Basalto, `temas.css`)**: fondo `#1A1D20`, superficie `#212529`/`#2A2F34`, línea `#30353A`, texto caliche `#ECEAE4`, secundario `#9A9D98`, acento lapislázuli claro `#8FA6E0` sólo para datos (estación sobre umbral) y foco. Estados: `#5DBB84` / `#E39A4A` / `#F07A6A`; el naranja marca reclamos en el mapa.
- **Tipo**: Archivo variable autoalojada (`assets/fonts`, subset latino, 100 KB). Titulares en ancho 72 / peso 700–720 en mayúsculas; cuerpo en ancho 100.
- **Hero, mapa de Blender** (`tools/blender/territorio.py`): un territorio de ejemplo hecho de 3.600 columnas, como un gráfico de barras del relieve (cordón al norte, estero, camino, Localidad Norte). Encima van los datos: cinco estaciones como barras cuya altura es el score, E-03 en lapislázuli por estar sobre el umbral de MP10, y los reclamos como marcas naranjas en la localidad. Nombres según `ejemplos-plataforma/pantallas/territorio_*`. En la web el terreno se levanta desde E-03 hacia afuera y luego suben las estaciones; los rótulos salen de `territorio.json`. Fallback: render Cycles del mismo modelo (sin WebGL o con `prefers-reduced-motion`).
- **Video de producto, sólo como fondo**: un fragmento de los flujos de datos (Remotion, escena 1) en bucle detrás del bloque de demo, atenuado con un degradado. Sin subtítulos ni audio; con `prefers-reduced-motion` queda el póster.
- Sin fotografía generada con IA.

### Regenerar assets
- Mapa: `blender -b -P tools/blender/territorio.py -- /tmp/terr --render`, luego `npx @gltf-transform/cli instance /tmp/terr/territorio.glb t1.glb`, `npx @gltf-transform/cli meshopt t1.glb assets/3d/territorio.glb`, copiar `territorio.json` y `cwebp` de `territorio.png` a `assets/3d/territorio.webp`.
- Fondo: en el proyecto Remotion, `npx remotion render src/index.ts Simcii conecta.mp4 --frames=15-205 --props='{"captions":false}' --muted`; de ahí 4,75–5,8 s recortado a las dos franjas sin texto (ondas de mediciones y puntos de reclamos, `crop=1370:250:448:345`), a media velocidad e ida y vuelta (`assets/video/datos-fondo.mp4`, 1280×234, sin audio) y su póster `.webp`.
- `assets/og-image.png` (2400×1260): titular de la home más el render del mapa.

## Phase 0 — Discovery (commit to words)

- **Artefacto**: Landing page B2B (marketing) para un SaaS de inteligencia territorial. Patrón híbrido: landing + "App Store style" (evidencia = screenshots reales del producto en marco).
- **Producto real** (según `docs/SIMCII/SIMCII_KNOWLEDGE_BASE.md`): plataforma IoT multi-tenant. Dominio **ambiental** (estaciones, parámetros, mediciones, score 0–100) + **social/territorial** (stakeholders en 5 tipos, compromisos, alertas, reclamos, encuestas, archivos, RCA). Scores: General / Territorial / Contexto / Comunidad. Frontend Angular + Tailwind + Mapbox. POC sobre datos mock.
- **Audiencia / WHY**: organizaciones con responsabilidad territorial (minería, energía, infraestructura, forestal, sector público). Deciden: relacionamiento comunitario, sostenibilidad, asuntos públicos, cumplimiento (RCA). Acción primaria: **solicitar una demo**.
- **Adjetivos de marca (locked)**: institucional · confiable · sobrio · preciso · arraigado (territorial).
- **Esencia estética (3 palabras)**: *informe de territorio*.
- **Tono de voz**: autoridad tranquila; afirma con evidencia, no con hype. SÍ: territorio, operación, evidencia, contexto; verbos medir/leer/anticipar; datos con fuente y fecha. NO: "revolucionario/disruptivo/mágico", jerga de IA (cerebros, redes neuronales), promesas sin respaldo.

## Phase 1 — Sistema de diseño

### Compromiso estético
Dark institucional editorial ("manual oscuro"). NO el dark+neón "tipo IA" anterior. Cartográfico, no sci-fi.

### Signature move
**La cordillera de 3 planos como dispositivo estructural y único elemento 3D.** Plano frontal terracota (macizo), plano medio azul cívico (contorno), plano de fondo gris (contorno). Expresa literalmente el concepto de marca "se lee en capas". Ancla el hero (3D low-poly flat-shaded), separa secciones (silueta SVG) y cierra el footer.

### Tipografía (brand-first)
- **Display/titulares**: **Manrope** (500 / 700 / 800). Tracking negativo en tamaños grandes. SIN serif. SIN itálica (el énfasis es por **color azul cívico** + peso, no por itálica — la itálica-serif es slop 2026).
- **Cuerpo**: **Source Sans 3** (400 / 600 / 700). 16px, line-height 1.55, medida ≤ ~70 car.
- **Datos/etiquetas/código**: **JetBrains Mono** (400 / 500). Versalitas, tracking 0.18–0.22em. Para `§`, coordenadas, fechas, números editoriales, tabular-nums.
- Escala: Display 72/0.92/-0.04em · H1 52/0.98/-0.03em · H2 32/1.05/-0.02em · H3 22/1.15/-0.01em · Body 16/1.55 · Caption 13/1.4 · Etiqueta 11/0.2em mayús.

### Color — paleta (dark corrected)
Paleta absoluta del manual (5 tonos) adaptada a fondo oscuro. Autoría conceptual en los hex del manual.

| Rol | Hex | Uso |
|---|---|---|
| `--bg` negro institucional | `#17181B` | Fondo de página |
| `--surface` | `#1F2024` | Cards, paneles |
| `--surface-2` elevado | `#26282C` | Hover / panel interno |
| `--ink` deep | `#121316` | CTA / footer profundo |
| `--paper` blanco documento | `#F5F2EB` | Texto principal |
| `--muted` | `rgba(245,242,235,0.64)` | Texto secundario |
| `--soft` | `rgba(245,242,235,0.40)` | Texto terciario |
| `--gris-ciudad` | `#8A8C8E` | **Estructura/labels/líneas — NUNCA texto de lectura** |
| `--line` | `rgba(245,242,235,0.10)` | Separadores |
| `--line-strong` | `rgba(245,242,235,0.18)` | Bordes |
| `--azul-civico` | `#2F5D7C` | Acento confianza: fills de sección, botón sólido |
| `--azul-claro` | `#5C82A0` | Acento sobre oscuro: links, eyebrows, énfasis (contraste AA) |
| `--azul-deep` | `#234A63` | Profundidad / plano medio cordillera |
| `--terracota` | `#B96B45` | **SEÑAL — solo puntual**: plano frontal cordillera, alerta, único acento del hero |
| `--terracota-deep` | `#9B4F30` | Error / alerta severa |

**Disciplina 60-30-10 → 55/25/12/08**: papel+negro dominan; azul cívico acentúa (12%); terracota señala (8%, raro). La terracota NUNCA es superficie extendida. Énfasis tipográfico = azul claro (no terracota, salvo el único acento del hero).

### Tokens (referencia: `:root` en `SIMCII.html`)
- Radio: `2px` (cantos casi rectos, editorial). Máx un segundo radio `0` para piezas técnicas.
- Sombra: **una sola aproximación** — borde definido (`1px var(--line-strong)`), sin drop-shadow difuso encima. Elevación por color, no por blur.
- Spacing base `8px`; ritmo apretado dentro de grupo, generoso entre secciones ("mucho aire").
- Grilla 12 col, `max-width` ~1320px, alineación a grilla, etiquetas mono.

### Adapter
Plain CSS custom properties en `<style>` de `SIMCII.html` (stack actual: React 18 + Babel standalone vía CDN, sin build). Los `.jsx` consumen `var(--token)`.

## Phase 2 — Craft layer

- **Layout**: cordillera como borde de sección; numeración editorial `§ NN` correlativa; bento donde el contenido varía. Romper el reflejo "columna centrada".
- **Componentes**: matriz de estados completa (default/hover/active/focus/disabled/loading/error). Botones rankeados por importancia (1 CTA primario por vista), no por color. Tablas/datos con tabular-nums y alineación derecha en números.
- **Motion**: comunicativa, ease-out < 300ms, solo `transform`/`opacity`. Scroll reveals con stagger 30–50ms. Parallax sutil de la cordillera. Count-up de scores. **`prefers-reduced-motion` respetado** (desactiva parallax/3D-orbit, deja estados legibles).
- **Elemento 3D**: cordillera low-poly flat-shaded con three.js (CDN). Colores de marca, sin texturas brillantes, sin partículas, sin glow. Lee como topografía/maqueta, no como render sci-fi. Fallback a silueta SVG si WebGL no disponible o reduced-motion.
- **Iconografía**: set territorial (territorio, ubicación, sensor, capas, alerta, dato, ruta, comunidad, reporte, ciudad, ciclo, escudo). Trazo 2u uniforme, esquinas a inglete, sin relleno. Sin "redes neuronales/circuitos". Tinte azul (info) o terracota (señal) solo para estados.
- **Imágenes**: screenshots reales del producto en marco editorial (browser/device frame) con pie en mono (lugar+fecha+"POC · datos demostrativos"). Sin stock, sin blobs, sin renders de IA. Capa oscura 30–50% si va texto encima.
- **Dark mode**: es el modo base (diseñado, no invertido). Near-black `#17181B`, off-white `#F5F2EB`, acentos desaturados.
- **Accesibilidad (gate AA)**: focus visible gestionado; contraste texto ≥4.5:1 (papel/negro = 14.8:1; azul-claro sobre negro verificar); color nunca único indicador (señales con icono+texto); targets ≥44px; `prefers-reduced-motion`.

## Reality gate (qué NO inventar)
Eliminado por no corresponder al producto real:
- ❌ Cobertura nacional "Chile dot-strip" (zona norte/sur/desierto/central).
- ❌ "Corte transversal" geológico con sensores/comunidades/arcos de correlación.
- ❌ Cartografía falsa: "ESCALA 1:50000 · DATUM WGS84", "Nodo A1", "Latencia de red < 5 min", "AQI".
- ❌ Diferenciador "potencial predictivo / modelos que anticipan conflictos" (no existe módulo ML) → reformular a evidencia/score real.
Permitido (real): multi-dominio ambiental+social, score 0–100 (General/Territorial/Contexto/Comunidad), mapa con zonas de riesgo + estaciones + capas + slider temporal, stakeholders (5 tipos), compromisos (overdue/pending/completed), alertas por severidad, encuestas, archivos, RCA, multi-tenant. Todo rotulado "demostrativo / datos mock".

## SEO (fase posterior — keywords objetivo)
plataforma monitoreo medioambiental · plataforma monitoreo social · plataforma monitoreo sostenibilidad · plataforma monitoreo comunidades · plataforma monitoreo online · regulación medioambiental · compromisos medioambientales · licencia social para la operación · KPIs medioambientales · gestión social · gestión medioambiental · gestión comunitaria · gestión territorios.

## Slop-audit
Pendiente: correr `references/slop-checklist.md` al cerrar el reskin. Registrar resultado aquí.

## Changelog
- 2026-06-30 · v0.1 · Discovery + sistema + reality gate. Antes de implementación.
- 2026-11-10 · v6 · Marca Dirección B en todo el sitio, promovida a `/`: mapa del territorio en columnas desde Blender en el hero, video de producto sólo como fondo del bloque de demo, subpáginas con `sub.css` nuevo, favicon y og-image nuevos.
