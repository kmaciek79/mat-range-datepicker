import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

import {matRangeDatepickerInputEvent, matRangeDatepickerRangeValue} from "../../mat-range-datepicker/src/public-api";
/** @title Datepicker selected value */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
})
export class AppComponent {
    date: matRangeDatepickerRangeValue<Date> ;
    lastDateInput: matRangeDatepickerRangeValue<Date>  | null;
    lastDateChange: matRangeDatepickerRangeValue<Date>  | null;

    onDateInput = (e: matRangeDatepickerInputEvent<Date>) => this.lastDateInput = e.value as matRangeDatepickerRangeValue<Date>;
    onDateChange = (e: matRangeDatepickerInputEvent<Date>) => this.lastDateChange = e.value as matRangeDatepickerRangeValue<Date>;
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */