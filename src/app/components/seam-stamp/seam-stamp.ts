import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Costura entre dos secciones: un sello de tinta cae y queda marcado
 * la primera vez que cruza el centro del viewport. Puntúa el salto de
 * una sección a otra sin tocar el scroll ni los pines de GSAP existentes.
 */
@Component({
  selector: 'app-seam-stamp',
  standalone: true,
  templateUrl: './seam-stamp.html',
  styleUrl: './seam-stamp.scss',
})
export class SeamStamp implements AfterViewInit {
  @ViewChild('seam') seamRef!: ElementRef<HTMLElement>;
  @ViewChild('mark') markRef!: ElementRef<HTMLElement>;

  private zone = inject(NgZone);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const mark = this.markRef.nativeElement;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      mark.classList.add('hit');
      return;
    }

    // Fuera de la zona de Angular: igual que smooth-scroll.ts, para que no
    // dependa de que la app alcance "estable" con los tickers de GSAP/Lenis corriendo.
    this.zone.runOutsideAngular(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            mark.classList.add('hit');
            observer.disconnect();
          }
        });
      }, { threshold: 0.6 });

      observer.observe(this.seamRef.nativeElement);
    });
  }
}
