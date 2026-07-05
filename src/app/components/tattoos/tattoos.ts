import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

interface TattooItem {
  id: string;
  image: string;
  title: string; // nombre propio de la pieza
  zone: string;  // zona del cuerpo
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
    { id: 'art01', image: 'images/tattoo1.webp', title: 'Oni', zone: 'Pierna' },
    { id: 'art02', image: 'images/tattoo9.webp', title: 'Hannya', zone: 'Pantorrilla' },
    { id: 'art03', image: 'images/tattoo4.webp', title: 'Polilla', zone: 'Muslo' },
    { id: 'art04', image: 'images/tattoo2.webp', title: 'Lirios en rojo', zone: 'Hombro' },
    { id: 'art05', image: 'images/tattoo10.webp', title: 'Rana Ronin', zone: 'Muslo' },
    { id: 'art06', image: 'images/tattoo7.webp', title: 'Monarca', zone: 'Mano' },
    { id: 'art07', image: 'images/tattoo3.webp', title: 'Samurái', zone: 'Muslo' },
    { id: 'art08', image: 'images/tattoo5.webp', title: 'Tulipanes', zone: 'Antebrazo' },
    { id: 'art09', image: 'images/tattoo8.webp', title: 'Con Dios', zone: 'Mano' },
    { id: 'art10', image: 'images/tattoo6.webp', title: 'Lirios en rojo', zone: 'Brazo' },
    { id: 'art11', image: 'images/tattoo12.webp', title: 'Sofía', zone: 'Antebrazo' },
    { id: 'art12', image: 'images/tattoo11.webp', title: 'Kitty', zone: 'Cadera' },
  ];

  private mm?: gsap.MatchMedia;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
      this.initDrag();
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
      stagger: 0.1,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
      }
    });
  }

  /**
   * Desktop: carrusel drag-to-scroll con inercia (estilo serotoninn).
   * gsap.matchMedia se encarga de crear/destruir según el viewport.
   */
  initDrag() {
    gsap.registerPlugin(Draggable, InertiaPlugin);

    const section = this.sectionRef.nativeElement as HTMLElement;
    const track = section.querySelector('.gallery-grid') as HTMLElement;
    const viewport = section.querySelector('.tattoos-wrapper') as HTMLElement;
    if (!track || !viewport) return;

    this.mm = gsap.matchMedia();
    this.mm.add('(min-width: 901px) and (pointer: fine)', () => {
      const bounds = () => ({
        minX: Math.min(0, viewport.clientWidth - track.scrollWidth - 40),
        maxX: 0,
      });

      const drag = Draggable.create(track, {
        type: 'x',
        bounds: bounds(),
        inertia: true,
        edgeResistance: 0.78,
      })[0];

      const onResize = () => drag.applyBounds(bounds());
      window.addEventListener('resize', onResize);

      return () => {
        window.removeEventListener('resize', onResize);
        drag.kill();
        gsap.set(track, { x: 0 });
      };
    });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.mm?.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
