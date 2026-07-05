import { Component, signal, OnInit, OnDestroy, Inject, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Intro } from '../../services/intro';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader implements OnInit, OnDestroy {
  progress = signal(0);
  isLeaving = signal(false);
  isHidden = signal(false);

  private intro = inject(Intro);
  private zone = inject(NgZone);
  private rafId = 0;

  // Imágenes que el hero necesita en pantalla: el contador refleja su carga real
  private readonly criticalImages = [
    'images/tattoo1.webp',
    'images/tattoo9.webp',
    'images/tattoo2.webp',
    'images/tattoo3.webp',
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => this.run());
  }

  private run() {
    const MIN_MS = 1600;  // tiempo mínimo: que el sello respire
    const MAX_MS = 5000;  // tiempo máximo: nunca retener al usuario más de esto
    const start = performance.now();
    const total = this.criticalImages.length;
    let loaded = 0;
    let shown = 0;

    this.criticalImages.forEach(src => {
      const img = new Image();
      img.onload = img.onerror = () => { loaded++; };
      img.src = src;
    });

    const tick = () => {
      const elapsed = performance.now() - start;
      const timeProgress = Math.min(elapsed / MIN_MS, 1);
      const loadProgress = elapsed >= MAX_MS ? 1 : loaded / total;
      const target = Math.min(timeProgress, loadProgress) * 100;

      // El número mostrado persigue al real con suavizado
      shown += (target - shown) * 0.14;
      const rounded = Math.round(shown);
      if (rounded !== this.progress()) {
        this.zone.run(() => this.progress.set(rounded));
      }

      if (shown >= 99.4 && target >= 100) {
        this.zone.run(() => {
          this.progress.set(100);
          this.leave();
        });
        return;
      }
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  private leave() {
    // Pequeña pausa en 100 y la cortina sube; el hero arranca en ese instante
    setTimeout(() => {
      this.isLeaving.set(true);
      this.intro.markDone();
      setTimeout(() => this.isHidden.set(true), 1000);
    }, 250);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
