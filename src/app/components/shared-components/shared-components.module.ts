import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//components
import { LoaderComponent } from './components/loader/loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
	declarations: [
		LoaderComponent,
		NavbarComponent
	],
	imports: [
		CommonModule,
		RouterModule
	],
	exports: [
		LoaderComponent,
		NavbarComponent
	],
	providers: [
	]
})
export class SharedComponentsModule { }
