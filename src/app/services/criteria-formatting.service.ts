import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';

@Injectable()
export class CriteriaFormattingService {
  constructor() { }

  formatCriteria(informationFormData) {
    let formattedCriteria = [];

    for (let key in informationFormData.criteriaFormData) {
      if (informationFormData.criteriaFormData[key] == true) {
        formattedCriteria.push(key);
      }
    }
    return formattedCriteria
  }

}