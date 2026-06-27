import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('heroWrapper') heroWrapper!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.animateEntrance();
    }
  }

  animateEntrance() {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = this.heroWrapper.nativeElement;
    const ornateText = wrapper.querySelector('.ornate-text');
    const modernTexts = wrapper.querySelectorAll('.modern-text');
    const inlineImage = wrapper.querySelector('.inline-image');
    const icon = wrapper.querySelector('.floating-icon');
    const scrollIndicator = wrapper.querySelector('.scroll-indicator');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Estado inicial
    gsap.set([ornateText, modernTexts, inlineImage, icon], { autoAlpha: 0, y: 50 });
    gsap.set(inlineImage, { clipPath: 'inset(0 100% 0 0)' }); // Prepara el efecto de revelado
    gsap.set(scrollIndicator, { autoAlpha: 0 });

    // Secuencia de animación
    tl.to(ornateText, { autoAlpha: 1, y: 0, duration: 1.2, color: '#F16405' }) // Transición al primario
      .to(modernTexts, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.2 }, "-=0.8")
      .to(inlineImage, { autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power4.inOut' }, "-=0.8")
      .to(icon, { autoAlpha: 1, y: 0, duration: 1, rotation: -15 }, "-=1");

    // Scroll indicator: fadeIn después de la animación de entrada
    gsap.to(scrollIndicator, { autoAlpha: 1, duration: 1, ease: 'power2.out', delay: 2 });

    // Parallax sutil de la foto al hacer scroll
    gsap.to(inlineImage, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
