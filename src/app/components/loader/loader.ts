import { Component, signal, OnInit, Inject, PLATFORM_ID, } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader implements OnInit {
  isFadingOut = signal(false);
  isHidden = signal(false);
  // Posición del mouse para mover el logo sutilmente
  mouseX = signal(0);
  mouseY = signal(0);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Start fading out after 2.5 seconds
      setTimeout(() => {
        this.isFadingOut.set(true);
        // Wait for fade out transition (1s) before completely hiding from DOM
        setTimeout(() => {
          this.isHidden.set(true);
        }, 1000);
      }, 2500);
    }
  }
}
