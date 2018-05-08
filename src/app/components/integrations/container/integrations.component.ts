import { Component } from '@angular/core';
//services
import { ReportService } from '../../../services/report.service';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'integrations',
  styleUrls: ['/integrations.component.scss'],
  template: `
  <div class="fret-integrations">
    <div class="m-portlet fret-integrations__card">
      <div class="m-portlet__head">
        <div class="m-portlet__head-caption">
          <div class="m-portlet__head-title">
            <h3 class="m-portlet__head-text">
              Integrations
            </h3>
          </div>
        </div>
      </div>
      <div class="m-portlet__body clearfix fret-report__output clearfix" style="padding-bottom: 45px;">
        <a class="btn btn-block btn-social btn-lg btn-facebook fret-integrations__social-button--facebook"
          [ngClass]="{'disabled': loggedInUser?.facebook_token }"
          href="/api/v1/auth/facebook">
          <i class="fa fa-facebook"></i><span *ngIf="!loggedInUser?.facebook_token">Connect to Ad Manager</span><span *ngIf="loggedInUser?.facebook_token">Connected</span>
        </a>
        <a class="btn btn-block btn-social btn-lg btn-google-plus fret-integrations__social-button--drive" 
          [ngClass]="{'disabled': loggedInUser?.google_token }"
          href="/api/v1/auth/google">
          <i class="fa fa-google"></i><span *ngIf="!loggedInUser?.google_token">Connect to Google Drive</span><span *ngIf="loggedInUser?.google_token">Connected</span>
        </a>
        <div *ngIf="showError" class="fret-login__error">
        <div *ngFor="let error of errors" class="fret-integrations-error">{{ error }}</div>
        </div>
        <button type="button" 
          class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air fret-integrations__continue-button"
          [disabled]="!loggedInUser?.facebook_token && !loggedInUser?.google_token" 
          (click)="continue()">Continue</button>
      </div>
    </div>
  </div>  
  `
})
export class IntegrationsComponent {
  constructor(private router: Router, private LoginService: LoginService) { }

  showError;
  errors = [];
  loggedInUser = null;

  ngOnInit() {
    this.loggedInUser = this.LoginService.getCurrentUser();
    if(!this.loggedInUser) {
      this.router.navigate(['/login/']);  
      return;
    }
  }

  continue() {
    this.router.navigate(['/dashboard/']);
  }
}