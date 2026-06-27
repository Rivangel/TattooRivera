import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface TattooItem {
  id: string;
  image: string;
  style: string;
}

@Component({
  selector: 'app-tattoos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tattoos.html',
  styleUrl: './tattoos.scss',
})
export class Tattoos implements AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef;

  gallery: TattooItem[] = [
    { id: 'art1', image: 'images/tattoo1.jpeg', style: 'Black & Grey' },
    { id: 'art2', image: 'images/tattoo2.jpeg', style: 'Fineline' },
    { id: 'art3', image: 'images/tattoo3.jpeg', style: 'Tradicional' },
    { id: 'art4', image: 'images/tattoo1.jpeg', style: 'Realismo' },
    { id: 'art5', image: 'images/tattoo2.jpeg', style: 'Lettering' },
    { id: 'art6', image: 'images/tattoo3.jpeg', style: 'Neotradicional' },
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
    const cards = gsap.utils.toArray('.gallery-card', section) as HTMLElement[];

    gsap.set(cards, { autoAlpha: 0, y: 60 });

    gsap.to(cards, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
      }
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
