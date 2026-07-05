import { Injectable, signal } from '@angular/core';

/**
 * Coordina la entrada del sitio: el loader avisa cuando su cortina
 * empieza a subir y el hero arranca su animación en ese instante,
 * de modo que ambas se encadenan como una sola timeline.
 */
@Injectable({ providedIn: 'root' })
export class Intro {
  readonly done = signal(false);

  markDone() {
    this.done.set(true);
  }
}
