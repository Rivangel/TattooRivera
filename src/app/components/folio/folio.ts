import { Component, Input } from '@angular/core';

/**
 * Ritual de folio: número correlativo + nombre, repetido en la misma
 * posición en cada sección de contenido. Es la señal mínima y constante
 * de "esto es un tramo nuevo de la página".
 */
@Component({
  selector: 'app-folio',
  standalone: true,
  templateUrl: './folio.html',
  styleUrl: './folio.scss',
})
export class Folio {
  @Input({ required: true }) num!: string;
  @Input({ required: true }) name!: string;
  /** Override puntual (ej. el hero necesita despejar el header fijo). */
  @Input() top?: string;
}
