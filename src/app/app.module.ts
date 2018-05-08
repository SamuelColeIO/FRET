
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

//modules
import { SharedComponentsModule } from './components/shared-components/shared-components.module';
import { LoginModule } from './components/login/login.module';
import { IntegrationsModule } from './components/integrations/integrations.module';
import { ReportModule } from './components/report/report.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { FormTestModule } from './components/form-test/form-test.module';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/container/login.component';
import { IntegrationsComponent } from './components/integrations/container/integrations.component';
import { ReportComponent } from './components/report/container/report.component';
import { DashboardComponent } from './components/dashboard/container/dashboard.component';
import { FormTestComponent } from './components/form-test/container/form-test.component';

//services
import { ReportService } from './services/report.service';
import { CriteriaFormattingService } from './services/criteria-formatting.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { TestService } from './services/test.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'integrations', component: IntegrationsComponent },
  { path: 'report', component: ReportComponent },
  { path: 'report/:id', component: ReportComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'form-test', component: FormTestComponent }
];

@NgModule({
  // define components which can be used in this module.
  declarations: [
    AppComponent
  ],
  // import other other modules for use in this module
  imports: [
    BrowserModule,
    CommonModule,
    SharedComponentsModule,
    LoginModule,
    IntegrationsModule,
    ReportModule,
    DashboardModule,
    FormTestModule,
    RouterModule.forRoot(routes, { useHash: true }),
  ],
  // services ect
  providers: [
    ReportService,
    CriteriaFormattingService,
    LoginService,
    { provide: Window, useValue: window },
    LogoutService,
    TestService
  ],
  // these components are available to other modules that import this one.
  exports: [
  ],
  // Load this one first
  bootstrap: [AppComponent]
})
export class AppModule { }