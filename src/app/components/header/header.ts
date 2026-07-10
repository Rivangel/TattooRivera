import { Component, AfterViewInit, OnDestroy, ElementRef, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Magnetic } from '../../directives/magnetic';

@Component({
  selector: 'app-header',
  imports: [Magnetic],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private cleanup: Array<() => void> = [];

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const header = this.el.nativeElement.querySelector('.tattoo-header') as HTMLElement;
    if (!header) return;

    // El header siempre queda visible; solo gana fondo sólido al bajar.
    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 60);
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.cleanup.push(() => window.removeEventListener('scroll', onScroll));
    });
  }

  ngOnDestroy() {
    this.cleanup.forEach(fn => fn());
  }
}
