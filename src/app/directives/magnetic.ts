import { Directive, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

/**
 * Botón magnético: el elemento se inclina hacia el cursor cuando se
 * acerca y regresa con rebote elástico al salir. Solo puntero fino.
 *
 * Uso: <a appMagnetic ...>
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class Magnetic implements AfterViewInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private zone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);
  private cleanup: Array<() => void> = [];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = this.el.nativeElement;

    this.zone.runOutsideAngular(() => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power3.out' });

      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const radius = Math.max(r.width, 130);

        if (dist < radius) {
          const pull = 1 - dist / radius;
          xTo(dx * pull * 0.5);
          yTo(dy * pull * 0.5);
        } else {
          xTo(0);
          yTo(0);
        }
      };

      const leave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      };

      window.addEventListener('mousemove', move, { passive: true });
      el.addEventListener('mouseleave', leave);
      this.cleanup.push(() => window.removeEventListener('mousemove', move));
      this.cleanup.push(() => el.removeEventListener('mouseleave', leave));
    });
  }

  ngOnDestroy() {
    this.cleanup.forEach(fn => fn());
  }
}
