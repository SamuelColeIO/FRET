import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './container/login.component';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    HttpModule,
    RouterModule,
    FormsModule
  ],
  exports: [
  ],
  providers: [
  ]
})
export class LoginModule { }
