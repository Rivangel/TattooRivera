import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Folio } from '../folio/folio';

interface QualityStandard {
  id: string;
  number: string;
  title: string;
  description: string;
}

/**
 * Sección 02 "Calidad" — "El Sello de Taller".
 *
 * La sección es un certificado del estudio: cada estándar es una entrada de
 * bitácora que se "sella" (un cuño verde de verificado cae con rebote) la
 * primera vez que el certificado cruza el viewport. Deliberadamente NO usa
 * pin+scrub de GSAP: ese gesto ya vive en la sección de escultura y repetirlo
 * confunde. Aquí el gesto es un reveal escalonado, al estilo de seam-stamp
 * (IntersectionObserver fuera de la zona de Angular + clases CSS).
 */
@Component({
  selector: 'app-quality-standards',
  standalone: true,
  imports: [Folio],
  templateUrl: './quality-standards.html',
  styleUrl: './quality-standards.scss',
})
export class QualityStandards implements AfterViewInit {
  @ViewChild('cert') certRef!: ElementRef<HTMLElement>;

  private zone = inject(NgZone);

  standards: QualityStandard[] = [
    {
      id: 'step1',
      number: '01',
      title: 'Higiene Clínica',
      description: 'Nuestros espacios son esterilizados bajo protocolos hospitalarios. Cada aguja es de un solo uso.',
    },
    {
      id: 'step2',
      number: '02',
      title: 'Tintas Premium',
      description: 'Solo utilizamos pigmentos veganos de la más alta calidad, testeados dermatológicamente.',
    },
    {
      id: 'step3',
      number: '03',
      title: 'Curación Guiada',
      description: 'Proveemos parches dérmicos y guías detalladas de cuidados post-tatuaje.',
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const cert = this.certRef.nativeElement;

    // "qs-anim": a partir de aquí JS gobierna la animación, así que el CSS
    // puede ocultar el estado inicial. Sin JS (SSR / fallo), el contenido se
    // ve completo — es contenido real, no decoración.
    cert.classList.add('qs-anim');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cert.classList.add('is-sealed');
      return;
    }

    // Fuera de la zona de Angular, igual que seam-stamp: no debe depender de
    // que la app alcance "estable" con los tickers perpetuos de GSAP corriendo.
    this.zone.runOutsideAngular(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            cert.classList.add('is-sealed');
            observer.disconnect();
          }
        });
      }, { threshold: 0.3 });

      observer.observe(cert);
    });
  }
}
