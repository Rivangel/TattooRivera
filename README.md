# Rivera Tattoo Studio

Sitio web para **Rivera Tattoo Studio**, un estudio de tatuajes en Tierra Blanca, Veracruz (México): landing con portafolio de trabajos, reserva de citas por WhatsApp y una capa de animación construida sección por sección en vez de partir de una plantilla genérica.

Proyecto real de cliente — diseño visual, arquitectura y animaciones desarrollados de punta a punta.

## Stack

- **Angular 20** — standalone components, control flow nativo (`@for` / `@if`), SSR + hidratación (`@angular/ssr`, `provideClientHydration`)
- **GSAP 3.14** — `ScrollTrigger` (pin, scrub, snap), `SplitText`, `Draggable` + `InertiaPlugin`
- **Lenis** — scroll suave global sincronizado con GSAP
- **SCSS** — sin frameworks de utilidades; sistema de diseño propio (variables, mixins, tipografía de marca)

## Lo que tiene el sitio

- **Loader con progreso real**: el contador combina la descarga real de las imágenes críticas del hero con un piso y techo de tiempo, para que nunca se sienta ni instantáneo ni eterno.
- **Hero cinético**: la tipografía se revela carácter por carácter al entrar (`SplitText`) y se reorganiza con el scroll.
- **Quality Standards**: sección fijada con scroll-scrub entre tres estándares del estudio; si el usuario suelta el scroll a mitad de una transición, un snap automático (`ScrollTrigger` sobre labels) la resuelve hacia el item más cercano en vez de dejarla a medias.
- **Sistema de wayfinding**: cada sección lleva un folio numerado, un riel lateral fijo resalta en qué parte de la página estás, y un sello de tinta marca la costura entre secciones — pensado para que un sitio de una sola página no se sienta como una sola línea repetitiva.
- **Galería drag-to-scroll**: carrusel horizontal con inercia (`Draggable` + `InertiaPlugin`) en desktop, scroll-snap nativo en móvil.
- **Cursor a medida**: punto con `mix-blend-mode: difference` que crece y anuncia la acción (`VER`, `DRAG`, `IR`) sobre los elementos interactivos.
- **Accesibilidad de movimiento**: las animaciones no esenciales respetan `prefers-reduced-motion`.
- **Responsive real**, probado en mobile (galería, botones, header) y no solo en el inspector.

## Arquitectura

- Cada sección de la página (`hero`, `quality-standards`, `about`, `tattoos`, `testimonials`, `faq`, `booking`, `folio`, `section-rail`, `seam-stamp`...) es un componente standalone independiente, compuestos en `app.html` — nada de un único componente monolítico.
- El trabajo dirigido por scroll (GSAP + Lenis) corre fuera de la zona de Angular (`NgZone.runOutsideAngular`) para no disparar change detection en cada frame.
- SSR real con hidratación: el contenido crítico (texto, meta tags Open Graph) se renderiza en servidor; las animaciones se inicializan solo en cliente (`isPlatformBrowser`).

## Desarrollo local

```bash
npm install
ng serve      # http://localhost:4200
ng build      # build de producción en dist/
```
