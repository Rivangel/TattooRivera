import { Component, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { Magnetic } from '../../directives/magnetic';

@Component({
  selector: 'app-header',
  imports: [Magnetic],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private cleanup: Array<() => void> = [];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const header = this.el.nativeElement.querySelector('.tattoo-header') as HTMLElement;
    if (!header) return;

    // Header inteligente: se esconde al bajar, reaparece al subir
    this.zone.runOutsideAngular(() => {
      let lastY = window.scrollY;
      let hidden = false;

      const onScroll = () => {
        const y = window.scrollY;
        const goingDown = y > lastY + 2;
        const goingUp = y < lastY - 2;

        if (goingDown && y > 160 && !hidden) {
          hidden = true;
          gsap.to(header, { yPercent: -110, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        } else if ((goingUp || y <= 160) && hidden) {
          hidden = false;
          gsap.to(header, { yPercent: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
        }

        header.classList.toggle('scrolled', y > 60);
        lastY = y;
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.cleanup.push(() => window.removeEventListener('scroll', onScroll));
    });
  }

  ngOnDestroy() {
    this.cleanup.forEach(fn => fn());
  }
}
