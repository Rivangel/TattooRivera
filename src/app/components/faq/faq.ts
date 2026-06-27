import { Component, AfterViewInit, OnDestroy, QueryList, ViewChildren, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq implements AfterViewInit, OnDestroy {
  @ViewChildren('panel') panels!: QueryList<ElementRef>;
  @ViewChildren('icon') icons!: QueryList<ElementRef>;

  activeIndex: number | null = null;

  items: FaqItem[] = [
    {
      question: '¿Cuánto cuesta un tatuaje?',
      answer: 'El precio depende del tamaño, la complejidad del diseño, el detalle y la zona del cuerpo. Tras valorar tu idea te damos un presupuesto cerrado y sin sorpresas antes de comenzar.'
    },
    {
      question: '¿Duele mucho el proceso?',
      answer: 'La sensación varía según la zona y el umbral de cada persona. Trabajamos con técnica precisa y descansos para que la sesión sea lo más cómoda posible.'
    },
    {
      question: '¿Qué cuidados debo tener después?',
      answer: 'Entregamos una guía detallada de cuidados post-tatuaje y, cuando aplica, parche dérmico. Mantener la zona limpia, hidratada y protegida del sol es clave para una buena cicatrización.'
    },
    {
      question: '¿Con cuánto tiempo debo agendar mi cita?',
      answer: 'Recomendamos reservar con al menos dos semanas de anticipación. Para piezas grandes o fechas concretas, cuanto antes escribas, mejor disponibilidad tendrás.'
    },
    {
      question: '¿Hacen diseños personalizados?',
      answer: 'Sí. Cada proyecto puede partir de cero según tu idea, referencias y estilo. Diseñamos contigo hasta lograr una pieza única antes de pasar a la piel.'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Estado inicial: todos los paneles colapsados
      this.panels.forEach(p => gsap.set(p.nativeElement, { height: 0, autoAlpha: 0 }));
    }
  }

  toggle(index: number) {
    if (!isPlatformBrowser(this.platformId)) {
      this.activeIndex = this.activeIndex === index ? null : index;
      return;
    }

    const panelsArr = this.panels.toArray();
    const iconsArr = this.icons.toArray();

    // Cierra el item activo si existe y es distinto
    if (this.activeIndex !== null && this.activeIndex !== index) {
      this.close(panelsArr[this.activeIndex], iconsArr[this.activeIndex]);
    }

    if (this.activeIndex === index) {
      // Si ya estaba abierto, lo cerramos
      this.close(panelsArr[index], iconsArr[index]);
      this.activeIndex = null;
    } else {
      // Abrimos el nuevo
      this.open(panelsArr[index], iconsArr[index]);
      this.activeIndex = index;
    }
  }

  private open(panel: ElementRef, icon: ElementRef) {
    gsap.to(panel.nativeElement, { height: 'auto', autoAlpha: 1, duration: 0.5, ease: 'power2.out' });
    gsap.to(icon.nativeElement, { rotation: 45, duration: 0.4, ease: 'power2.out' });
  }

  private close(panel: ElementRef, icon: ElementRef) {
    gsap.to(panel.nativeElement, { height: 0, autoAlpha: 0, duration: 0.4, ease: 'power2.in' });
    gsap.to(icon.nativeElement, { rotation: 0, duration: 0.4, ease: 'power2.in' });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.panels?.forEach(p => gsap.killTweensOf(p.nativeElement));
      this.icons?.forEach(i => gsap.killTweensOf(i.nativeElement));
    }
  }
}
