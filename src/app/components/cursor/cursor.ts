import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

/**
 * Cursor personalizado (estilo serotoninn): un punto blanco con
 * mix-blend-mode: difference que invierte lo que cruza. Sobre elementos
 * con [data-cursor] crece y muestra la palabra ("VER", "DRAG", "IR").
 * Solo existe en dispositivos con puntero fino y sin motion reducido.
 */
@Component({
  selector: 'app-cursor',
  standalone: true,
  templateUrl: './cursor.html',
  styleUrl: './cursor.scss',
})
export class Cursor implements AfterViewInit, OnDestroy {
  @ViewChild('dot') dotRef!: ElementRef<HTMLElement>;
  @ViewChild('label') labelRef!: ElementRef<HTMLElement>;

  private zone = inject(NgZone);
  private cleanup: Array<() => void> = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = this.dotRef.nativeElement;
    const label = this.labelRef.nativeElement;

    document.documentElement.classList.add('has-custom-cursor');
    dot.classList.add('on');

    this.zone.runOutsideAngular(() => {
      const xTo = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3.out' });
      const yTo = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3.out' });

      const move = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };

      // Crece y anuncia la acción cuando el destino declara [data-cursor]
      const over = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest?.('[data-cursor]') as HTMLElement | null;
        if (target) {
          label.textContent = target.dataset['cursor'] ?? '';
          dot.classList.add('grow');
        } else {
          dot.classList.remove('grow');
        }
      };

      window.addEventListener('mousemove', move, { passive: true });
      window.addEventListener('mouseover', over, { passive: true });
      this.cleanup.push(() => window.removeEventListener('mousemove', move));
      this.cleanup.push(() => window.removeEventListener('mouseover', over));
    });
  }

  ngOnDestroy() {
    this.cleanup.forEach(fn => fn());
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.remove('has-custom-cursor');
    }
  }
}
