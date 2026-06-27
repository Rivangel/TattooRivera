import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface Stat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef;

  stats: Stat[] = [
    { value: '2 años', label: 'De experiencia' },
    { value: '+100', label: 'Tatuajes realizados' },
    { value: 'Veracruz', label: 'México' },
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
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
