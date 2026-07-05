import { Component } from '@angular/core';

interface Testimonial {
  quote: string;
  author: string;
  detail: string; // ej. 'Blackwork · Antebrazo'
  image?: string; // foto del tatuaje terminado, ej. 'images/tattoo4.webp'
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss',
})
export class Testimonials {
  // TODO: agregar testimonios reales de clientes.
  // Mientras el arreglo esté vacío, la sección no se renderiza.
  // Ejemplo:
  // {
  //   quote: 'Un trato increíble y un trazo limpísimo. Volveré por la segunda sesión.',
  //   author: 'María G.',
  //   detail: 'Blackwork · Antebrazo',
  //   image: 'images/tattoo4.webp',
  // },
  testimonials: Testimonial[] = [];

  // Dos copias del contenido: el marquee de -50% se reinicia sin costura
  readonly copies = [0, 1];
}
