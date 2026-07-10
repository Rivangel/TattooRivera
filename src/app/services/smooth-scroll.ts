import { Injectable, Inject, PLATFORM_ID, NgZone, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Scroll suave global (Lenis) sincronizado con ScrollTrigger.
 * Corre fuera de Angular para no disparar change detection en cada frame.
 */
@Injectable({ providedIn: 'root' })
export class SmoothScroll implements OnDestroy {
  private lenis?: Lenis;
  private tick = (time: number) => this.lenis?.raf(time * 1000);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
  ) { }

  init() {
    if (!isPlatformBrowser(this.platformId) || this.lenis) return;
    // Con motion reducido el scroll nativo es el correcto
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    this.zone.runOutsideAngular(() => {
      this.lenis = new Lenis({
        duration: 0.6,
        anchors: true, // los href="#seccion" siguen funcionando, ahora suaves
      });
      this.lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(this.tick);
      gsap.ticker.lagSmoothing(0);
    });
  }

  scrollTo(target: string | HTMLElement) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.lenis) {
      this.lenis.scrollTo(target, { offset: -70 });
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  stop() { this.lenis?.stop(); }
  start() { this.lenis?.start(); }

  ngOnDestroy() {
    if (this.lenis) {
      gsap.ticker.remove(this.tick);
      this.lenis.destroy();
      this.lenis = undefined;
    }
  }
}
