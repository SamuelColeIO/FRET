import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Rx';
import { CriteriaFormattingService } from '../services/criteria-formatting.service';

import 'rxjs/add/operator/map';

@Injectable()
export class ReportService {
	constructor(private http: Http, private CriteriaFormattingService: CriteriaFormattingService) { }

	create(originalInformationFormData: any, driveFormData: object): Observable<any> {
		let formattedCriteria = this.CriteriaFormattingService.formatCriteria(originalInformationFormData);
		let informationFormData = Object.assign({}, originalInformationFormData);
		let campaignName = informationFormData.campaign.name;
		let campaignId = informationFormData.campaign.id;
		informationFormData.campaign = campaignId;
		informationFormData.campaignName = campaignName;
		let options = "";
		return this.http.post('/api/v1/report/create', { informationFormData, driveFormData, formattedCriteria }, options)
			.map((res: Response) => res.json())
	}

	remove(id: string): Observable<any> {
		let options = "";
		return this.http.delete('/api/v1/report/' + id, options)
			.map((res: Response) => res.json())
	}

	index(): Observable<any> {
		return this.http.get('/api/v1/report/index')
			.map((res: Response) => res.json())
	}

	templateIndex(): Observable<any> {
		return this.http.get('/api/v1/template/index')
			.map((res: Response) => res.json())
	}

	update(informationFormData: object, driveFormData: object, reportId: string): Observable<any> {
		let formattedCriteria = this.CriteriaFormattingService.formatCriteria(informationFormData);
		// let options = "";
		return this.http.put('/api/v1/report/update', { informationFormData, driveFormData, formattedCriteria, reportId })
			.map((res: Response) => res.json())
	}

	retrieve(id: string): Observable<any> {
		let options = "";
		return this.http.get('/api/v1/report/' + id, options)
			.map((res: Response) => res.json())
			.catch((error: any) => Observable.throw(error.json()));
	}

	campaignIndex(id): Observable<any> {
		let options = "";
		return this.http.get(`/api/v1/campaign/index/${id}`, options)
			.map((res: Response) => res.json())
	}

	adAccountIndex(): Observable<any> {
		return this.http.get('/api/v1/ad-account/index')
			.map((res: Response) => res.json())
	}

	runReportNow(reportId): Observable<any> {
		return this.http.get(`/api/v1/report/run-now/${reportId}`)
			.map((res: Response) => res.json())
	}

	handleError() {

	}
}