import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'loader',
  styleUrls: ['/loader.component.scss'],
  template: `
  <div *ngIf="toggleLoader" class="m-loader m-loader--brand fret-loader" style="width: 30px; display: inline-block;"></div>
  `
})
export class LoaderComponent {

  @Input()
  toggleLoader;
}