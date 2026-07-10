import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Folio } from '../folio/folio';

interface QualityStandard {
  id: string;
  number: string;
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-quality-standards',
  standalone: true,
  imports: [CommonModule, Folio],
  templateUrl: './quality-standards.html',
  styleUrl: './quality-standards.scss',
})
export class QualityStandards implements AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef;
  @ViewChild('numbersWrapper') numbersWrapperRef!: ElementRef;

  standards: QualityStandard[] = [
    {
      id: 'step1',
      number: '01',
      title: 'Higiene Clínica',
      description: 'Nuestros espacios son esterilizados bajo protocolos hospitalarios. Cada aguja es de un solo uso.',
      imageUrl: 'images/tattoo1.webp'
    },
    {
      id: 'step2',
      number: '02',
      title: 'Tintas Premium',
      description: 'Solo utilizamos pigmentos veganos de la más alta calidad, testeados dermatológicamente.',
      imageUrl: 'images/tattoo2.webp'
    },
    {
      id: 'step3',
      number: '03',
      title: 'Curación Guiada',
      description: 'Proveemos parches dérmicos y guías detalladas de cuidados post-tatuaje.',
      imageUrl: 'images/tattoo3.webp'
    }
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
    const titles = gsap.utils.toArray('.qs-title-item', section) as HTMLElement[];
    const numbers = gsap.utils.toArray('.qs-number', section) as HTMLElement[];
    const bgs = gsap.utils.toArray('.qs-bg-image', section) as HTMLElement[];
    const descs = gsap.utils.toArray('.qs-desc-item', section) as HTMLElement[];
    const ledgerTicks = gsap.utils.toArray('.qs-ledger-tick', section) as HTMLElement[];

    const totalItems = this.standards.length;

    // 1. Configuramos el estado inicial de los elementos
    gsap.set(bgs, { opacity: 0 });
    gsap.set(bgs[0], { opacity: 1 });
    gsap.set(titles, { autoAlpha: 0, y: 50 });
    gsap.set(titles[0], { autoAlpha: 1, y: 0 });
    gsap.set(descs, { autoAlpha: 0, y: 50 });
    gsap.set(descs[0], { autoAlpha: 1, y: 0 });

    // 2. Estilo inicial de los números (Gothic Aesthetic)
    gsap.set(numbers, {
      color: 'transparent',
      webkitTextStroke: '2px #333',
      opacity: 0.3
    });
    gsap.set(numbers[0], {
      color: '#F16405',
      webkitTextStroke: '0px #F16405',
      opacity: 1
    });

    // 2b. Riel de folios ("ledger evolution"): el mismo timeline de scrub
    // suma un tercer testigo del avance, además del número y el título.
    gsap.set(ledgerTicks, { backgroundColor: 'rgba(247,247,242,0.15)' });
    gsap.set(ledgerTicks[0], { backgroundColor: '#F16405' });

    // 3. Timeline principal con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalItems * 120}%`,
        pin: true,
        scrub: 0.3,
        // Si el scroll se suelta a medias de una transición (incluida la
        // zona muerta), "snapea" al item completo más cercano en vez de
        // dejar la sección a medio desvanecer.
        snap: {
          snapTo: 'labels',
          duration: { min: 0.15, max: 0.55 },
          delay: 0,
          ease: 'power2.out',
        },
      }
    });

    // Cada label marca un item ya asentado (completamente visible): son
    // los puntos válidos de reposo a los que el snap de arriba puede caer.
    tl.addLabel('item0');

    // 4. Animación iterativa con zona muerta entre transiciones
    for (let i = 0; i < totalItems - 1; i++) {
      const outLabel = `out${i}`;

      // SALIDA del item actual (dura 0.8 unidades)
      tl.to(titles[i], { autoAlpha: 0, y: -40, duration: 0.8 }, outLabel)
        .to(descs[i], { autoAlpha: 0, y: -40, duration: 0.8 }, outLabel)
        .to(bgs[i], { opacity: 0, duration: 0.8 }, outLabel)
        .to(numbers[i], {
          color: 'transparent',
          webkitTextStroke: '2px #333',
          opacity: 0.3,
          duration: 0.8
        }, outLabel)
        .to(ledgerTicks[i], { backgroundColor: 'rgba(247,247,242,0.15)', duration: 0.8 }, outLabel)
        .to(this.numbersWrapperRef.nativeElement, {
          yPercent: -((i + 1) * (100 / totalItems)),
          duration: 0.8,
          ease: 'power2.inOut'
        }, outLabel)

      // ZONA MUERTA de 0.4 unidades — nada visible durante este gap
      // (el += encadena después del bloque anterior)

      // ENTRADA del item siguiente (empieza después de la zona muerta)
      tl.to(titles[i + 1], { autoAlpha: 1, y: 0, duration: 0.8 }, `+=${0.4}`)
        .to(descs[i + 1], { autoAlpha: 1, y: 0, duration: 0.8 }, '<')
        .to(bgs[i + 1], { opacity: 1, duration: 0.8 }, '<')
        .to(numbers[i + 1], {
          color: '#F16405',
          webkitTextStroke: '0px #F16405',
          opacity: 1,
          duration: 0.8
        }, '<')
        .to(ledgerTicks[i + 1], { backgroundColor: '#F16405', duration: 0.8 }, '<');

      tl.addLabel(`item${i + 1}`);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      // Limpieza segura de GSAP
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}