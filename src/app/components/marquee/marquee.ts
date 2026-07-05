import { Component, Input } from '@angular/core';

/**
 * Cinta infinita de texto (estilo TattooFest): dos grupos idénticos
 * desplazados -50% en loop. Se pausa al hover y se desactiva con
 * prefers-reduced-motion desde el SCSS.
 */
@Component({
  selector: 'app-marquee',
  standalone: true,
  templateUrl: './marquee.html',
  styleUrl: './marquee.scss',
})
export class Marquee {
  @Input() items: string[] = [
    'Black & Grey',
    'Fineline',
    'Realismo',
    'Lettering',
    'Neotradicional',
    'Tierra Blanca · Veracruz',
  ];

  // Dos copias del contenido para que el loop de -50% sea invisible
  readonly copies = [0, 1];
}
