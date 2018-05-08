import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//shared module
import { SharedComponentsModule } from './../shared-components/shared-components.module';

//container
import { ReportComponent } from './container/report.component';

@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentsModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class ReportModule { }
