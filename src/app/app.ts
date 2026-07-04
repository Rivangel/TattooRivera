import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { QualityStandards } from './components/quality-standards/quality-standards';
import { Portfolio } from './components/portfolio/portfolio';
import { Faq } from './components/faq/faq';
import { Footer } from './components/footer/footer';
import { Tattoos } from './components/tattoos/tattoos';
import { Loader } from './components/loader/loader';
import { Hero } from './components/hero/hero';
import { About } from './components/about/about';
import { Booking } from './components/booking/booking';
import { Testimonials } from './components/testimonials/testimonials';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, QualityStandards, About, Tattoos, Testimonials, Faq, Booking, Footer, Portfolio, Loader, Hero],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('TattooRivera');
}
