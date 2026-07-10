import { Component, signal, AfterViewInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { QualityStandards } from './components/quality-standards/quality-standards';
import { Faq } from './components/faq/faq';
import { Footer } from './components/footer/footer';
import { Tattoos } from './components/tattoos/tattoos';
import { Loader } from './components/loader/loader';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Booking } from './components/booking/booking';
import { Testimonials } from './components/testimonials/testimonials';
import { Marquee } from './components/marquee/marquee';
import { Cursor } from './components/cursor/cursor';
import { SectionRail } from './components/section-rail/section-rail';
import { SeamStamp } from './components/seam-stamp/seam-stamp';
import { SmoothScroll } from './services/smooth-scroll';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, QualityStandards, About, Tattoos, Testimonials, Faq, Booking, Footer, Loader, Hero, Marquee, Cursor, SectionRail, SeamStamp],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('TattooRivera');
  private smoothScroll = inject(SmoothScroll);

  ngAfterViewInit() {
    this.smoothScroll.init();
  }
}
