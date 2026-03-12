import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

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
  imports: [CommonModule],
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
      imageUrl: 'images/tattoo1.jpeg'
    },
    {
      id: 'step2',
      number: '02',
      title: 'Tintas Premium',
      description: 'Solo utilizamos pigmentos veganos de la más alta calidad, testeados dermatológicamente.',
      imageUrl: 'images/tattoo2.jpeg'
    },
    {
      id: 'step3',
      number: '03',
      title: 'Curación Guiada',
      description: 'Proveemos parches dérmicos y guías detalladas de cuidados post-tatuaje.',
      imageUrl: 'images/tattoo3.jpeg'
    },
    {
      id: 'step4',
      number: '04',
      title: 'Reconocimientos',
      description: 'Reconocimientos por parte de la industria del tatuaje.',
      imageUrl: 'images/Reconocimiento.jpeg'
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

    // 3. Timeline principal con ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: `+=${totalItems * 100}%`,
        pin: true,
        scrub: 1,
      }
    });

    // 4. Animación iterativa 
    for (let i = 0; i < totalItems - 1; i++) {
      const label = `step${i}`;

      tl.to(titles[i], { autoAlpha: 0, y: -50, duration: 1 }, label)
        .to(descs[i], { autoAlpha: 0, y: -50, duration: 1 }, label)
        .to(bgs[i], { opacity: 0, duration: 1 }, label)
        .to(numbers[i], {
          color: 'transparent',
          webkitTextStroke: '2px #333',
          opacity: 0.3,
          duration: 1
        }, label)
        .to(this.numbersWrapperRef.nativeElement, {
          yPercent: - ((i + 1) * (100 / totalItems)),
          duration: 1,
          ease: "power1.inOut"
        }, label)
        .to(titles[i + 1], { autoAlpha: 1, y: 0, duration: 1 }, label)
        .to(descs[i + 1], { autoAlpha: 1, y: 0, duration: 1 }, label)
        .to(bgs[i + 1], { opacity: 1, duration: 1 }, label)
        .to(numbers[i + 1], {
          color: '#F16405',
          webkitTextStroke: '0px #F16405',
          opacity: 1,
          duration: 1
        }, label);
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      // Limpieza segura de GSAP
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}