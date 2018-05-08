import { Component } from '@angular/core';

@Component({
	selector: 'app-root',
	styles: [`
	:host {
		height: 100%;
	}
`],
	template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}