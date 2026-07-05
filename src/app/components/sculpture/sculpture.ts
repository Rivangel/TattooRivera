import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

/**
 * Escultura scroll-scrub (técnica Monolith/Apple): la sección se fija
 * mientras el scroll rota una nube de puntos del escaneo 3D de
 * "Le Transi de René de Chalon" (Ligier Richier, 1545 — threedscans.com).
 *
 * El modelo llega como Int16 cuantizado (x,y,z · 38k puntos · 223 KB),
 * pre-procesado desde el OBJ original de 495k vértices.
 */
@Component({
  selector: 'app-sculpture',
  standalone: true,
  templateUrl: './sculpture.html',
  styleUrl: './sculpture.scss',
})
export class Sculpture implements AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef<HTMLElement>;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hud') hudRef!: ElementRef<HTMLElement>;

  private zone = inject(NgZone);
  private points?: Int16Array;
  private ctx?: CanvasRenderingContext2D;
  private st?: ScrollTrigger;
  private W = 0;
  private H = 0;
  private lastProgress = 0;
  private cleanup: Array<() => void> = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    gsap.registerPlugin(ScrollTrigger);

    fetch('models/le-transi.bin')
      .then(r => {
        if (!r.ok) throw new Error(String(r.status));
        return r.arrayBuffer();
      })
      .then(buf => {
        this.points = new Int16Array(buf);
        this.zone.runOutsideAngular(() => this.setup());
      })
      .catch(() => {
        // Sin modelo la sección queda como interludio tipográfico
      });
  }

  private setup() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d') ?? undefined;
    if (!this.ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.W = canvas.clientWidth;
      this.H = canvas.clientHeight;
      canvas.width = this.W * dpr;
      canvas.height = this.H * dpr;
      this.ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.draw(this.lastProgress);
    };
    window.addEventListener('resize', resize);
    this.cleanup.push(() => window.removeEventListener('resize', resize));
    resize();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Pose fija de tres cuartos, sin pin: el scroll no queda secuestrado
      this.draw(0.38);
      return;
    }

    this.st = ScrollTrigger.create({
      trigger: this.sectionRef.nativeElement,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: 0.6,
      onUpdate: self => this.draw(self.progress),
    });
    // El pin añade espacio al documento: recalcular los demás triggers
    ScrollTrigger.refresh();
    this.draw(0);
  }

  /** progress 0→1 = una vuelta completa de la estatua sobre su eje */
  private draw(progress: number) {
    const pts = this.points;
    const ctx = this.ctx;
    if (!pts || !ctx) return;
    this.lastProgress = progress;

    const W = this.W, H = this.H;
    ctx.clearRect(0, 0, W, H);

    const angle = progress * Math.PI * 2;
    const ca = Math.cos(angle), sa = Math.sin(angle);
    const tilt = 0.12, ct = Math.cos(tilt), st = Math.sin(tilt);
    const scale = H * 0.42; // la estatua ocupa ~84% de la altura
    const f = 3.2;          // distancia focal de la perspectiva
    const Q = 1 / 32767;
    // Cada punto son 3 enteros; en pantallas chicas dibujamos la mitad
    const stride = W < 768 ? 6 : 3;

    for (let i = 0; i < pts.length - 2; i += stride) {
      const x = pts[i] * Q;
      const y = pts[i + 1] * Q;
      const z = pts[i + 2] * Q;

      // Rotación sobre el eje vertical + leve inclinación
      const rx = x * ca + z * sa;
      let rz = -x * sa + z * ca;
      const ry = y * ct - rz * st;
      rz = y * st + rz * ct;

      const per = f / (f + rz);
      const sx = W / 2 + rx * scale * per;
      const sy = H / 2 - ry * scale * per;

      // Los puntos cercanos brillan más y son más grandes
      const lum = Math.max(0, Math.min(1, (per - 0.78) / 0.6));
      ctx.globalAlpha = 0.12 + lum * 0.78;
      ctx.fillStyle = i % 99 === 0 ? '#F16405' : '#F7F7F2';
      const s = 0.8 + lum * 1.6;
      ctx.fillRect(sx, sy, s, s);
    }
    ctx.globalAlpha = 1;

    if (this.hudRef) {
      this.hudRef.nativeElement.textContent = Math.round(progress * 360) + '°';
    }
  }

  ngOnDestroy() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cleanup.forEach(fn => fn());
    this.st?.kill();
  }
}
