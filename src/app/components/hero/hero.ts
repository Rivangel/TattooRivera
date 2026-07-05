import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID, inject, Injector, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Intro } from '../../services/intro';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class Hero implements AfterViewInit, OnDestroy {
  @ViewChild('heroWrapper') heroWrapper!: ElementRef;

  private intro = inject(Intro);
  private injector = inject(Injector);
  private split?: SplitText;
  private started = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    this.prepare();

    // El hero arranca en el instante en que la cortina del loader empieza a subir
    effect(() => {
      if (this.intro.done() && !this.started) {
        this.started = true;
        this.animateEntrance();
      }
    }, { injector: this.injector });
  }

  /** Estado inicial: todo oculto mientras el loader está en pantalla */
  private prepare() {
    const wrapper = this.heroWrapper.nativeElement;
    const ornateText = wrapper.querySelector('.ornate-text');
    const modernTexts = wrapper.querySelectorAll('.modern-text');
    const inlineImage = wrapper.querySelector('.inline-image');
    const icon = wrapper.querySelector('.floating-icon');
    const scrollIndicator = wrapper.querySelector('.scroll-indicator');

    gsap.set([ornateText, modernTexts, inlineImage, icon], { autoAlpha: 0 });
    gsap.set(inlineImage, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(scrollIndicator, { autoAlpha: 0 });
  }

  animateEntrance() {
    const wrapper = this.heroWrapper.nativeElement;
    const ornateText = wrapper.querySelector('.ornate-text');
    const modernTexts = wrapper.querySelectorAll('.modern-text');
    const line1 = wrapper.querySelector('.line-1');
    const line2 = wrapper.querySelector('.line-2');
    const inlineImage = wrapper.querySelector('.inline-image');
    const icon = wrapper.querySelector('.floating-icon');
    const scrollIndicator = wrapper.querySelector('.scroll-indicator');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([ornateText, modernTexts, inlineImage, icon, scrollIndicator], { autoAlpha: 1 });
      gsap.set(inlineImage, { clipPath: 'none' });
      return;
    }

    // Tipografía cinética solo en "Tattoo": cada letra sube tras una máscara.
    // "Studio" no se divide porque background-clip: text (la foto dentro del
    // texto) se rompe al fragmentar en spans transformados.
    this.split = new SplitText(line1, { type: 'chars', mask: 'chars' });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl
      // "Rivera": la firma llega de un blur, como tinta asentándose
      .fromTo(ornateText,
        { autoAlpha: 0, y: 40, filter: 'blur(8px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, color: '#F16405' })
      // "Tattoo": revelado carácter por carácter
      .set(line1, { autoAlpha: 1 }, '-=0.9')
      .from(this.split.chars, {
        yPercent: 120,
        rotation: 4,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.045,
      }, '-=0.9')
      // "Studio" (con la foto dentro de la tipografía): cortina de abajo hacia arriba
      .fromTo(line2,
        { autoAlpha: 0, clipPath: 'inset(100% 0 0 0)', y: 30 },
        { autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.2, ease: 'power4.out' }, '-=0.7')
      // La foto se revela como cortina lateral
      .to(inlineImage, { autoAlpha: 1, clipPath: 'inset(0 0% 0 0)', duration: 1.5, ease: 'power4.inOut' }, '-=1.1')
      .to(icon, { autoAlpha: 1, y: 0, duration: 1, rotation: -15 }, '-=1');

    gsap.to(scrollIndicator, { autoAlpha: 1, duration: 1, ease: 'power2.out', delay: 2 });

    // Scroll story: al bajar, la composición se separa — "Rivera" sube,
    // "Tattoo" y "Studio" se abren a los lados y la foto crece con parallax
    gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      }
    })
      .to(ornateText, { yPercent: -90, autoAlpha: 0.4, ease: 'none' }, 0)
      .to(line1, { xPercent: -7, ease: 'none' }, 0)
      .to(line2, { xPercent: 7, ease: 'none' }, 0)
      .to(inlineImage, { yPercent: -18, scale: 1.15, ease: 'none' }, 0)
      .to(scrollIndicator, { autoAlpha: 0, ease: 'none' }, 0);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.split?.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
