import { Component } from '@angular/core';

interface Testimonial {
  quote: string;
  author: string;
  detail: string; // ej. 'Blackwork · Antebrazo'
  image?: string; // foto del tatuaje terminado, ej. 'images/tattoo4.jpeg'
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
  //   image: 'images/tattoo4.jpeg',
  // },
  testimonials: Testimonial[] = [];
}
