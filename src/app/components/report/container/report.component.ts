import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReportService } from '../../../services/report.service';
import { LoginService } from '../../../services/login.service';

declare let gapi: any;
declare let google: any;

@Component({
  selector: 'report',
  styleUrls: ['/report.component.scss'],
  template: `
<navbar></navbar>
<div class="m-portlet fret-report__card" *ngIf="!formDataisLoading">
	<div class="m-portlet__head">
		<div class="m-portlet__head-caption">
			<div class="m-portlet__head-title">
				<h3 class="m-portlet__head-text">
          Customize Columns 
				</h3>
			</div>
		</div>
  </div>
  <div class="m-portlet__body clearfix">
    <div class="fret-report__criteria">
        <form *ngFor="let criteria of criteriaOptions" class="fret-report__criteria-criteria">
          <label class="m-checkbox m-checkbox--success">
            <input type="checkbox" [(ngModel)]="informationFormData.criteriaFormData[criteria.field]" name="{{ criteria.field }}" [disabled]="criteria.disabled || formDataisLoading" /> {{ criteria.pretty }}
            <span></span>
          </label>
        </form>
    </div>
    <div class="fret-report__chosen-criteria">
    </div>
    <div class="fret-report__name">
    <span><b>Report Template Name</b><span class="fret-report__asterix">*</span></span>
      <input class="form-control m-input m-input--air"
        placeholder="New Report Template Name" 
        [(ngModel)]="informationFormData.reportStyleName"
        [disabled] ="informationFormData.reportStyle?.length && informationFormData.reportStyle !== 'unselected' ? 'disabled' : null || formDataisLoading" />
      <span>or Select an Existing Template</span>
      <select class="form-control m-input m-input--air" 
        [(ngModel)]="informationFormData.reportStyle"
        [disabled]="informationFormData.reportStyleName?.length || formDataisLoading"  
        #report="ngModel" 
        name="report" 
        (ngModelChange)="updateCheckboxes($event)">
        <option></option>
        <option *ngFor="let templ of templs" [ngValue]="templ._id">{{templ.name}}</option>
      </select>
      <div *ngIf="!informationFormData.reportStyle && !informationFormData.reportStyleName && reportTemplateError" class="fret-report__template-error">Please either name your report template or select an existing report template</div>
    </div>
	</div>
</div>
<form #reportForm="ngForm" (ngSubmit)="submitForm(reportForm.form.valid)">
<!-- information section-->
<div class="m-portlet fret-report__card" *ngIf="!formDataisLoading">
	<div class="m-portlet__head">
		<div class="m-portlet__head-caption">
			<div class="m-portlet__head-title">
				<h3 class="m-portlet__head-text">
          Information
				</h3>
			</div>
		</div>
	</div>
  <div class="m-portlet__body clearfix fret-report__information">

    <span>Report Name<span class="fret-report__asterix">*</span></span>
    <input class="form-control m-input m-input--air"
      placeholder="Enter name" 
      [(ngModel)]="informationFormData.name" 
      name="name" 
      #name="ngModel" 
      [disabled]="formDataisLoading" required />
    <div *ngIf="(name.errors?.required && (name.dirty || name.touched)) || (name.errors?.required && submitAttempted)" class="fret-report__form-error">A name is required.</div>

    <span *ngIf="mode!='edit'">Ad Account<span class="fret-report__asterix">*</span></span>
    <select [hidden]="mode=='edit'" class="form-control m-input m-input--air" [(ngModel)]="informationFormData.adAccount"
    (ngModelChange)="adAccountChanged()" name="adAccount" #adAccount="ngModel" [disabled]="formDataisLoading" [required]="mode!='edit'">
      <option *ngFor="let adAccount of adAccounts" [ngValue]="adAccount.id">{{adAccount.account_id}}</option>
    </select>
    <div *ngIf="adAccount.errors?.required && (adAccount.dirty || adAccount.touched) || (adAccount.errors?.required && submitAttempted)" class="fret-report__form-error">An Ad Account is required.</div>

    <span>Campaign<span class="fret-report__asterix">*</span></span>
    <select *ngIf="mode!='edit'" class="form-control m-input m-input--air" [(ngModel)]="informationFormData.campaign"
    name="campaign" #campaign="ngModel" [disabled]="formDataisLoading || !campaigns?.length">
      <option [ngValue]="unselected">Select a campaign</option>
      <option *ngFor="let campaignOption of campaigns" [ngValue]="campaignOption">{{campaignOption.name}}</option>
    </select>
    <input *ngIf="mode=='edit'" class="form-control m-input m-input--air" [(ngModel)]="informationFormData.campaignName" name="campaignName" #campaignName="ngModel" disabled />
   
    <span>Time Frame<span class="fret-report__asterix">*</span></span>
    <select class="form-control m-input m-input--air" [(ngModel)]="informationFormData.timeFrame" name="timeFrame" #timeFrame="ngModel" [disabled]="formDataisLoading" required>
      <option [ngValue]="unselected">Choose a time frame</option>
      <option value="last_3d">Last 3 Days</option>
      <option value="last_7d">Last 7 Days</option>
      <option value="last_14d">Last 14 Days</option>
      <option value="last_30d">Last 30 Days</option>
      <option value="lifetime">Lifetime</option>
    </select>
    <div *ngIf="timeFrame.errors?.required && (timeFrame.dirty || timeFrame.touched) || (timeFrame.errors?.required && submitAttempted)" class="fret-report__form-error">A time frame is required.</div>

    <span>Schedule<span class="fret-report__asterix">*</span></span>
    <select class="form-control m-input m-input--air" [(ngModel)]="informationFormData.schedule" name="schedule" #schedule="ngModel" [disabled]="formDataisLoading" required>
      <option [ngValue]="unselected">Set a schedule</option>
      <option value="immediately">Run Immediately</option>
      <option value="every-hour">Every Hour</option>
      <option value="every-day">Every Day</option>
      <option value="every-week">Every Week</option>
      <option value="every-month">Every Month</option>
    </select>
    <div *ngIf="schedule.errors?.required && (schedule.dirty || schedule.touched) || (schedule.errors?.required && submitAttempted)" class="fret-report__form-error">A schedule is required.</div>

	</div>
</div>
<!-- output section-->
<div class="m-portlet fret-report__card" *ngIf="!formDataisLoading">
	<div class="m-portlet__head">
		<div class="m-portlet__head-caption">
			<div class="m-portlet__head-title">
				<h3 class="m-portlet__head-text">
          Report Output
				</h3>
			</div>
		</div>
	</div>
  <div class="m-portlet__body clearfix fret-report__output">
    <div *ngIf="mode!='edit'">
      <span>Choose a Google Drive Directory<span class="fret-report__asterix">*</span></span>
      <button
        type=button
        (click)="createAndOpenPicker()"
        class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air fret-report__picker-button">
        {{ selectFolderButtonText }}
      </button>
    </div>
    <span>Google Sheet File Name<span class="fret-report__asterix">*</span></span>
    <input class="form-control m-input m-input--air" placeholder="File name" [(ngModel)]="driveFormData.fileName" name="fileName" #fileName="ngModel" [disabled]="mode=='edit' ? true : null" required />
    <div *ngIf="fileName.errors?.required && (fileName.dirty || fileName.touched) || (fileName.errors?.required && submitAttempted)" class="fret-report__form-error">A file name is required.</div>

    <span>Google Sheet Title<span class="fret-report__asterix">*</span></span>
    <input class="form-control m-input m-input--air" placeholder="File title" [(ngModel)]="driveFormData.fileTitle" name="fileTitle" #fileTitle="ngModel" [disabled]="mode=='edit' ? true : null" required />
    <div *ngIf="fileTitle.errors?.required && (fileTitle.dirty || fileTitle.touched) || (fileTitle.errors?.required && submitAttempted)" class="fret-report__form-error">A file title is required.</div>

    <span>Append or Overwrite<span class="fret-report__asterix">*</span></span>
    <select class="form-control m-input m-input--air" [(ngModel)]="driveFormData.repeatType" name="repeatType" #repeatType="ngModel" [disabled]="formDataisLoading" required>
      <option [ngValue]="unselected">Choose to append or overwrite</option>
      <option value="INSERT_ROWS">Append</option>
      <option value="OVERWRITE">Overwrite</option>
    </select>
    <div *ngIf="repeatType.errors?.required && (repeatType.dirty || repeatType.touched) || (repeatType.errors?.required && submitAttempted)" class="fret-report__form-error">Append or Overwrite is required.</div>

	</div>
</div>
<!-- submit section  -->
<div class="m-portlet fret-report__card">
  <div class="m-portlet__body clearfix" *ngIf="!formDataisLoading">
    <button
      *ngIf="mode!='edit'"
      type="submit"
      [disabled]="loadingSave"
      [ngClass]="{'m-loader m-loader--right m-loader--light': loadingSave}"
      id="m_login_signin_submit"
      class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
      Save Report
    </button>

    <button
    *ngIf="mode=='edit'"
    type="submit"
    [disabled]="loadingSave"
    [ngClass]="{'m-loader m-loader--right m-loader--light': loadingSave}"
    id="m_login_signin_submit"
    class="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air">
    Update Report
  </button>
  <div *ngFor="let error of submitErrors"class="fret-report__submit-errors">{{ error }}</div>
  </div>
</div>
</form>
<loader [toggleLoader]="toggleLoader"></loader>
`
})
export class ReportComponent {
  constructor(private router: Router, private route: ActivatedRoute, private ReportService: ReportService, private LoginService: LoginService) { }

  mode: string;
  reportId: string;
  informationFormData: any = {
    criteriaFormData: {
      name: true
    },
  };
  driveFormData: any = {};
  toggleLoader: boolean = false;
  loadingSave: boolean = false;
  error: string;
  loggedInUser: any = null;
  fileChosen: boolean = false;
  selectFolderButtonText: string = "Choose a Folder";
  templs: any = null;
  campaigns: any = null;
  retrieveComplete: boolean;
  templateIndexCompleted: boolean;
  formDataisLoading: boolean = false;
  adAccounts: any = null;
  submitAttempted: boolean = null;
  submitErrors: any[] = [];
  reportTemplateError: boolean = false;

  criteriaOptions = [
    { "pretty": "Reporting starts", "field": "date_start" },
    { "pretty": "Reporting ends", "field": "date_stop" },
    { "pretty": "Ad set name", "field": "name", "disabled": "true" },
    { "pretty": "Delivery", "field": "effective_status" },
    { "pretty": "Budget", "field": "daily_budget" },
    { "pretty": "Budget type", "field": "budget-type" },
    { "pretty": "Impressions", "field": "impressions" },
    { "pretty": "Frequency", "field": "frequency" },
    { "pretty": "Amount spent", "field": "spend" },
    { "pretty": "Website purchases", "field": "offsite_conversion_fb_pixel_purchase" },
    { "pretty": "Website purchases conversion value", "field": "offsite_conversion_value_fb_pixel_purchase" },
    { "pretty": "Website purchase ROAS (return on advertising spend)", "field": "website_purchase_roas" },
    { "pretty": "Reach", "field": "reach" },
    { "pretty": "Video percentage watched", "field": "video_avg_percent_watched_actions" },
    { "pretty": "Video watched at 75%", "field": "video_p75_watched_actions" },
    { "pretty": "Outbound clicks", "field": "outbound_click" },
    { "pretty": "Outbound CTR (click-through rate)", "field": "outbound_clicks_ctr" },
    { "pretty": "Post comments", "field": "comment" },
    { "pretty": "Post reactions", "field": "post_reaction" },
    { "pretty": "Post shares", "field": "post" },
    { "pretty": "Website content views", "field": "offsite_conversion_fb_pixel_view_content" },
    { "pretty": "Website adds to cart", "field": "offsite_conversion_fb_pixel_add_to_cart" },
    { "pretty": "Website checkouts initiated", "field": "offsite_conversion_fb_pixel_initiate_checkout" },
    { "pretty": "Button clicks", "field": "call_to_action_clicks" },
    { "pretty": "3-second video views", "field": "video_view" },
    { "pretty": "Video average watch time", "field": "video_avg_time_watched_actions" }
  ];


  submitForm(valid: boolean) {
    this.submitAttempted = true;
    this.submitErrors = [];
    this.reportTemplateError = false;
    if(!valid) {
      this.submitErrors.push("Please check the form for omitted fields");
      return;
    }
    if(!(this.informationFormData.reportStyleName || this.informationFormData.reportStyle)) {
      this.reportTemplateError = true;
      this.submitErrors.push("Please check the form for omitted fields");
    }
    if(!this.fileChosen && this.mode == 'create') {
      this.submitErrors.push("Please choose a Google Drive folder");
    }
    if(!this.informationFormData.campaign) {
      this.submitErrors.push("Please select a campaign");
    }
    if(this.submitErrors.length){
      return;
    }
    this.loadingSave = true;
    if (this.mode == 'edit') {
      this.ReportService.update(this.informationFormData, this.driveFormData, this.reportId)
        .subscribe(data => {
          this.loadingSave = false;
          this.router.navigate(['/dashboard/']);
        },
          err => {
            this.error = err.data.error;
            this.loadingSave = false;
          }
        );
    }
    else if (this.mode == 'create') {
      this.ReportService.create(this.informationFormData, this.driveFormData)
        .subscribe(data => {
          this.loadingSave = false;
          this.router.navigate(['/dashboard/']);
        },
          err => {
            this.error = err.data.error;
            this.loadingSave = false;
          }
        );
    }
  }

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
    this.route.params
      .subscribe((data: Params) => {
        if (!data.id) {
          this.mode = "create";
          this.reportId = this.generateId<String>();

          this.LoginService.checkGoogleAccessToken(this.loggedInUser.google_token)
            .subscribe(data => {
              this.loadPickerConfig();
            },
              err => {
                if (err.status == 400) {

                  this.LoginService.refreshGoogleAccessToken()
                    .subscribe(data => {
                      this.loggedInUser.google_token = data.google_token;
                      this.LoginService.updateCurrentUser(this.loggedInUser);
                      this.loadPickerConfig();
                    },
                      err => {
                      }
                    )
                }
              }
            )
        }
        else {
          this.mode = "edit"
          this.reportId = data.id;
          this.formDataisLoading = true;
          this.toggleLoader = true;
          this.ReportService.retrieve(this.reportId)
            .subscribe(data => {
              let returnedFormData = data.data[0];
              this.informationFormData.reportStyle = returnedFormData.report_template;
              this.informationFormData.name = returnedFormData.name;
              this.informationFormData.campaign = returnedFormData.campaign;
              this.informationFormData.campaignName = returnedFormData.campaign_name;
              this.informationFormData.timeFrame = returnedFormData.selected_time_frame;
              this.informationFormData.schedule = returnedFormData.selected_schedule;
              this.driveFormData.fileName = returnedFormData.sheet_config.file_name;
              this.driveFormData.fileTitle = returnedFormData.sheet_config.tab_name;
              this.driveFormData.fileId = returnedFormData.sheet_config.file_id;
              this.driveFormData.repeatType = returnedFormData.sheet_config.repeat_type;
              this.retrieveComplete = true;
              this.formDataisLoading = false;
              this.haveBothServicesCompleted();
            },
              err => {
                this.error = err.data.error;
              }
            )
        }
      });

    this.ReportService.templateIndex()
      .subscribe((data: Params) => {
        this.templs = data.data;
        if (this.mode == "edit") {
          this.templateIndexCompleted = true;
          this.haveBothServicesCompleted();
        }
      });

    this.ReportService.adAccountIndex()
      .subscribe((data: Params) => {
        this.adAccounts = data.data;
      });
  }

  generateId<String>() {
    return "99";
  }

  haveBothServicesCompleted() {
    if (this.templateIndexCompleted && this.retrieveComplete) {
      this.updateCheckboxes("initial criteria");
    }
  }

  // Scope to use to access user's photos.
  scope = ['https://www.googleapis.com/auth/drive.readonly'];

  pickerAuthLoaded = false;

  loadPickerConfig() {
    gapi.load('picker', { 'callback': this.onLoadPickerConfigSuccess.bind(this) });
  }

  onLoadPickerConfigSuccess() {
    this.pickerAuthLoaded = true;
  }

  createAndOpenPicker() {
    if (this.pickerAuthLoaded) {
      let view = new google.picker.DocsView(google.picker.ViewId.FOLDERS)
        .setSelectFolderEnabled(true).
        setParent('root');
      let picker = new google.picker.PickerBuilder().
        addView(view).
        setTitle("Select a Folder").
        setOAuthToken(this.loggedInUser.google_token).
        setDeveloperKey(this.developerKey).
        setCallback(this.pickerCallback).
        build();
      picker.setVisible(true);
    }
  }

  adAccountChanged() {
    this.informationFormData.campaign = null;
    this.getCampaigns(this.informationFormData.adAccount)
  }

  getCampaigns(adAccountId: string) {
    this.ReportService.campaignIndex(adAccountId)
      .subscribe((data: Params) => {
        this.campaigns = data.data;
      })
  }

  pickerCallback = (data: any) => {
    this.selectFolderButtonText = "Folder Chosen";
    if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
      let doc = data[google.picker.Response.DOCUMENTS][0];
      this.driveFormData.itemId = doc.id;
      this.driveFormData.itemName = doc.name;
    }
    this.fileChosen = true;
  }

  updateCheckboxes(selected: string[] | string) {
    this.informationFormData.criteriaFormData = {};
    this.informationFormData.criteriaFormData["name"] = true;
    if (selected != "") {
      let templateStyle = this.informationFormData.reportStyle;
      let returnedTemplateCriteria;
      let forEachCounter = [];
      this.templs.forEach(function (template) {
        if (template._id == templateStyle) {
          returnedTemplateCriteria = template.fields;
        }
        forEachCounter.push(template);
        if (forEachCounter.length === this.templs.length) {
          this.pushToCheckboxes(returnedTemplateCriteria);
        }
      }.bind(this))
    }
  }

  pushToCheckboxes(returnedTemplateCriteria: string[]) {
    let test = "date_start";
    returnedTemplateCriteria.forEach(function (returnedCriteria) {
      this.criteriaOptions.forEach(function (criteria) {
        if (criteria.field == returnedCriteria) {
          this.informationFormData.criteriaFormData[returnedCriteria] = true;
        }
      }.bind(this));
    }.bind(this));
    this.toggleLoader = false;
  }
}