import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule],
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

  scrollToGallery(event: Event) {
    event.preventDefault();
    if (!isPlatformBrowser(this.platformId)) return;
    const target = document.getElementById('tattoos');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      ScrollTrigger.getAll().forEach(t => t.kill());
    }
  }
}
