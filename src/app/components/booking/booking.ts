import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SmoothScroll } from '../../services/smooth-scroll';
import { Magnetic } from '../../directives/magnetic';
import { Folio } from '../folio/folio';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, Magnetic, Folio],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking implements AfterViewInit, OnDestroy {
  @ViewChild('section') sectionRef!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const section = this.sectionRef.nativeElement;
    const content = section.querySelector('.booking-content');

    gsap.set(content, { autoAlpha: 0, y: 60, scale: 0.92 });

    gsap.to(content, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
      }
    });
  }

  private smoothScroll = inject(SmoothScroll);

  scrollToGallery(event: Event) {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    this.smoothScroll.scrollTo('#tattoos');
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
