import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface RailSection {
  id: string;
  label: string;
}

/**
 * Riel lateral fijo (solo desktop): un punto por sección de contenido,
 * el activo se resalta según qué sección cruza el centro del viewport.
 * Es lectura, no navegación — nunca fue pensado como menú clicable.
 */
@Component({
  selector: 'app-section-rail',
  standalone: true,
  templateUrl: './section-rail.html',
  styleUrl: './section-rail.scss',
})
export class SectionRail implements AfterViewInit, OnDestroy {
  readonly sections: RailSection[] = [
    { id: 'hero', label: 'Hero' },
    { id: 'quality-standards', label: 'Calidad' },
    { id: 'about', label: 'Nosotros' },
    { id: 'tattoos', label: 'Galería' },
    { id: 'testimonials', label: 'Testimonios' },
    { id: 'faq', label: 'FAQ' },
    { id: 'booking', label: 'Reserva' },
  ];

  readonly active = signal('hero');
  private observer?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    // Bajo 900px el riel va oculto (ver section-rail.scss): no vale la pena observar.
    if (window.matchMedia('(max-width: 899px)').matches) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.active.set(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    this.sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) this.observer!.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
