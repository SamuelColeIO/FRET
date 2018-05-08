import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

//services
import { LoginService } from '../../../services/login.service';
import { ReportService } from '../../../services/report.service';

//interfaces
import { LoginModel } from '../../../interfaces/model.interface';

@Component({
  selector: 'login',
  styleUrls: ['/login.component.scss'],
  providers: [LoginService],
  template: `
  <div class="m-grid m-grid--hor m-grid--root m-page" style="height: 100%;">
  <div class="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--signin" id="m_login">
    <div class="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside">
      <div class="m-stack m-stack--hor m-stack--desktop">
        <div class="m-stack__item m-stack__item--fluid">
          <div class="m-login__wrapper">
            <div class="m-login__logo">
              <a href="#">
              </a>
            </div>
            <div class="m-login__signin">
              <div class="m-login__head">
                <h3 class="m-login__title">
                  Sign In to Facebook Reporting Export Tool
                </h3>
              </div>
              <form (ngSubmit)="login()" #f="ngForm" class="m-login__form m-form" action="">
							<div class="form-group m-form__group">
								<input class="form-control m-input" type="text" placeholder="Email" name="email" [(ngModel)]="model.email" #email="ngModel" autocomplete="off">
							</div>
							<div class="form-group m-form__group">
								<input class="form-control m-input m-login__form-input--last" type="password" placeholder="Password" name="password" [(ngModel)]="model.password" #password="ngModel">
							</div>
              <div class="row m-login__form-sub">
							</div>
							<div class="m-login__form-action">
								<button [disabled]="loading" [ngClass]="{'m-loader m-loader--right m-loader--light': loading}" id="m_login_signin_submit" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
									Sign In
								</button>
							</div>
            </form>
            <div class="fret-login__error">{{ error }}</div>
            </div>
          </div>
        </div>
        <div class="m-stack__item m-stack__item--center">
        </div>
      </div>
    </div>
    <div class="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content" style="background-image: url(../../../images/media/app/img/bg/bg-4.jpg)">
      <div class="m-grid__item m-grid__item--middle">
        <h3 class="m-login__welcome">
        Facebook Reporting Export Tool
        </h3>
        <p class="m-login__msg">
        </p>
      </div>
    </div>
  </div>
</div>
  `
})
export class LoginComponent {
  constructor(private LoginService: LoginService, private router: Router) { }
  model: LoginModel = { "email": null, "password": null };
  error;
  returnedData = [];
  integrationsSet = false;
  loading = false;
  loggedInUser = null;

  ngOnInit() {
    this.loggedInUser = this.LoginService.getCurrentUser();
    if(this.loggedInUser) {
      this.router.navigate(['/integrations/']);
    }
  }

  login = () => {
    this.loading = true;
    this.error = null;
    this.LoginService.submitLogin(this.model.email, this.model.password)
      .subscribe(data => {
        this.LoginService.updateCurrentUser(data);
        if (this.integrationsSet == true) {
          this.router.navigate(['/dashboard/']);
        }
        else if (this.integrationsSet == false) {
          this.router.navigate(['/integrations/']);
        }
      },
        err => {
          this.error = err.statusText;
          this.loading = false;
        }
      );
  }
}