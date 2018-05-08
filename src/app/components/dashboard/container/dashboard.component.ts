import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { LoginService } from '../../../services/login.service';
import * as moment from 'moment';

@Component({
  selector: 'dashboard',
  styleUrls: ['/dashboard.component.scss'],
  template: `
  <navbar></navbar>
  <div class="m-portlet m-portlet--mobile fret-dashboard">
    <div class="m-portlet__body">
      <div class="m-form m-form--label-align-right">
        {{loggedInUser?.email}}
        <span (click)="createReport()" class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air fret-dashboard__create-button">
          Create
        </span>
        <div class="m-datatable m-datatable--default m-datatable--brand m-datatable--loaded">
          <table class="m-datatable__table  fret-dashboard__table" id="html_table" width="100%" style="display: block; overflow-x: auto;">
            <thead class="m-datatable__head">
              <tr class="m-datatable__row" style="left: 0px;">
                <th title="Field #1" class="m-datatable__cell m-datatable__cell--sort fret-dashboard__cell-1" data-field="Name"  width="20%">
                  <span>Name</span>
                </th>
                <th title="Field #2" class="m-datatable__cell m-datatable__cell--sort fret-dashboard__cell-2" data-field="Template" width="15%">
                  <span>Template</span>
                </th>
                <th title="Field #2" class="m-datatable__cell m-datatable__cell--sort fret-dashboard__cell-3" data-field="Scheduled" width="15%">
                  <span>Scheduled</span>
                </th>
                <th title="Field #3" class="m-datatable__cell m-datatable__cell--sort fret-dashboard__cell-4" data-field="Created On" width="15%">
                  <span>Created On</span>
                </th>
                <th title="Field #4" class="m-datatable__cell m-datatable__cell--sort fret-dashboard__cell-5" width="35%">
              </th>
              </tr>
            </thead>
            <tbody *ngIf="!reportInfo.length && !toggleLoader" class="m-datatable__body" style="padding: 20px;">
            Create a report to begin
            </tbody>
            <tbody class="m-datatable__body" style="">
              <tr data-row="1" class="m-datatable__row m-datatable__row--even" style="left: 0px;" *ngFor="let report of reportInfo">
                <td data-field="Order ID" class="m-datatable__cell fret-dashboard__cell-1" width="20%">
                  <span>{{ report.name }}</span>
                </td>
                <td data-field="Owner" class="m-datatable__cell fret-dashboard__cell-2" width="15%">
                  <span>{{ report.report_template.name }}</span>
                </td>
                <td data-field="Owner" class="m-datatable__cell fret-dashboard__cell-3" width="15%">
                  <span>{{ report.selected_schedule }}</span>
                </td>
                <td data-field="Order Date" class="m-datatable__cell fret-dashboard__cell-4" width="15%">
                  <span>{{ report.createdAt }}</span>
                </td>
                <td data-field="Run" class="m-datatable__cell fret-dashboard__cell-5" width="35%" style="text-align: right;">
                  <button
                    type="button"
                    [disabled]="loadingRun[report._id]"
                    [ngClass]="{'m-loader m-loader--right m-loader--light': loadingRun[report._id]}"
                    class="btn m-btn--pill btn-success btn-sm fret-dashboard__small-button"
                    (click)="runReport(report._id)">
                    Run
                  </button>
                  &nbsp;
                  <button type="button" class="btn m-btn--pill btn-info btn-sm fret-dashboard__small-button" (click)="editReport(report._id)">
                    Edit
                  </button>
                  &nbsp;
                  <button
                    type="button"
                    [disabled]="loadingDelete[report._id]"
                    [ngClass]="{'m-loader m-loader--right m-loader--light': loadingDelete[report._id]}"
                    class="btn m-btn--pill btn-danger btn-sm fret-dashboard__small-button"
                    (click)="deleteReport(report._id, report.name)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="fret-dashboard__error">{{ error }}</div>
  </div>
  <loader [toggleLoader]="toggleLoader"></loader>
  `
})
export class DashboardComponent {
  constructor(private router: Router, private ReportService: ReportService, private LoginService: LoginService) { }

  loadingRun = [];
  loadingDelete = [];
  toggleLoader = false;
  error;
  loggedInUser = null;
  reportInfo = [];

  ngOnInit() {
    this.loggedInUser = this.LoginService.getCurrentUser();
    if (!this.loggedInUser) {
      this.router.navigate(['/login/']);
      return;
    }
    if (!this.loggedInUser.facebook_token || !this.loggedInUser.google_token) {
      this.router.navigate(['/integrations/']);
      return;
    }
    this.populateTable();
  }

  populateTable() {
    this.toggleLoader = true;
    this.ReportService.index()
      .subscribe(data => {
        this.toggleLoader = false;
        this.reportInfo = data.data;
        this.reportInfo.forEach((item) => {
          item.createdAt = moment(item.createdAt).format('MM/DD/YY');
        })
      },
        err => {
          this.toggleLoader = false;
          this.error = err.data.error;
        }
      )
  }

  createReport() {
    this.router.navigate(['/report/']);
  }

  runReport(reportId) {
    this.loadingRun[reportId] = true;

    this.ReportService.runReportNow(reportId)
      .subscribe(data => {
        this.loadingRun[reportId] = false;
      },
        err => {
          this.error = err.data.error;
        }
      )
  }

  editReport(reportId) {
    this.router.navigate(['/report/' + reportId]);
  }

  deleteReport(reportId, reportName) {
    if (confirm("Are you sure you want to delete " + reportName + "?")) {
      this.loadingDelete[reportId] = true;
      this.ReportService.remove(reportId)
        .subscribe(data => {
          this.populateTable();
        },
          err => {
            this.error = err.data.error;
          }
        );
    }
  }
}