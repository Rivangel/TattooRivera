import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Folio } from '../folio/folio';

interface Stat {
  display: string;   // valor final (lo que renderiza SSR y usuarios sin JS)
  label: string;
  countTo?: number;  // si existe, el número cuenta de 0 hasta aquí al entrar en pantalla
  prefix?: string;
  suffix?: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, Folio],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef;

  stats: Stat[] = [
    { display: '2 años', countTo: 2, suffix: ' años', label: 'De experiencia' },
    { display: '+100', countTo: 100, prefix: '+', label: 'Tatuajes realizados' },
    { display: 'Veracruz', label: 'México' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const section = this.sectionRef.nativeElement;
    const media = section.querySelector('.about-media');
    const content = section.querySelector('.about-content');

    gsap.set(media, { autoAlpha: 0, x: -80 });
    gsap.set(content, { autoAlpha: 0, x: 80 });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
      },
      defaults: { duration: 1.1, ease: 'power3.out' }
    })
      .to(media, { autoAlpha: 1, x: 0 })
      .to(content, { autoAlpha: 1, x: 0 }, '-=0.8');

    this.initCounters(section);
  }

  // Los números "se ganan" contando desde 0 cuando entran en pantalla
  private initCounters(section: HTMLElement) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const values = section.querySelectorAll<HTMLElement>('.stat-value[data-count]');
    values.forEach(el => {
      const target = Number(el.dataset['count']);
      const prefix = el.dataset['prefix'] ?? '';
      const suffix = el.dataset['suffix'] ?? '';
      const state = { n: 0 };

      gsap.to(state, {
        n: target,
        duration: 1.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        onUpdate: () => {
          el.textContent = prefix + Math.round(state.n) + suffix;
        },
      });
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
