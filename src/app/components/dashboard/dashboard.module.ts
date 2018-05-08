import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//shared module
import { SharedComponentsModule } from './../shared-components/shared-components.module';

//container
import { DashboardComponent } from './container/dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SharedComponentsModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class DashboardModule { }
