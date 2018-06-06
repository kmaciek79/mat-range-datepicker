/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ComponentPortal, ComponentType, Portal} from '@angular/cdk/portal';
import {
    AfterContentInit,
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    Optional,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {createMissingDateImplError} from './datepicker-errors';
import {matRangeDatepickerIntl} from './datepicker-intl';
import {SatMonthView} from './month-view';
import {SatMultiYearView, yearsPerPage} from './multi-year-view';
import {SatYearView} from './year-view';

import {matRangeDatepickerRangeValue} from './datepicker-input';
import {DateAdapter} from '../datetime/date-adapter';
import {MAT_DATE_FORMATS, MatDateFormats} from '../datetime/date-formats';

/**
 * Possible views for the calendar.
 * @docs-private
 */
export type SatCalendarView = 'month' | 'year' | 'multi-year';



/**
 * A calendar that is used as part of the datepicker.
 * @docs-private
 */
@Component({
  moduleId: module.id,
  selector: 'range-calendar',
  templateUrl: 'range-calendar.html',
  styleUrls: ['calendar.css'],
  host: {
    'class': 'range-calendar',
  },
  exportAs: 'matRangeCalendar',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeCalendar<D> {
  @Input() id: any;
  @Input() ngClass: any;
  @Input() startAt: any;
  @Input() startView: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() dateFilter: any;
  @Input() beginDate: any;
  @Input() endDate: any;
  @Input() rangeMode: any;
  @Input() selected: any;
  @Output() selectedChange: any = new EventEmitter();
  @Output() dateRangesChange: any = new EventEmitter();
  @Output() yearSelected: any = new EventEmitter();
  @Output() monthSelected: any = new EventEmitter();
  @Output() _userSelection: any = new EventEmitter();
  /** Whenever user already selected start of dates interval. */
  private _beginDateSelected = false;

  constructor(_intl: matRangeDatepickerIntl,
    @Optional() private _dateAdapter: DateAdapter<D>,
    @Optional() @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats) {

    if (!this._dateAdapter) {
    throw createMissingDateImplError('DateAdapter');
    }

    if (!this._dateFormats) {
    throw createMissingDateImplError('MAT_DATE_FORMATS');
    }
  }

  _dateSelected(date: D): void {
    if (this.rangeMode) {
      if (!this._beginDateSelected) {
        this._beginDateSelected = true;
        this.beginDate = date;
        this.endDate = date;
      } else {
        this._beginDateSelected = false;
        if (this._dateAdapter.compareDate(<D>this.beginDate, date) <= 0) {
          this.dateRangesChange.emit({begin: <D>this.beginDate, end: date});
        } else {
          this.dateRangesChange.emit({begin: date, end: <D>this.beginDate});
        }
      }
    } else if (!this._dateAdapter.sameDate(date, this.selected)) {
      this.selectedChange.emit(date);
    }
  }

  _getQuarterDates(quarter: number) {
    const _year = this._dateAdapter.getYear(this._dateAdapter.today());
    const begin = this._dateAdapter.createDate(_year, (quarter - 1) * 3 , 1);
    const end = (
      quarter === 4
      ?
      this._dateAdapter.createDate(_year, 11, 30)
      :
      this._dateAdapter.addCalendarDays(
        this._dateAdapter.createDate(_year, quarter * 3, 1),
        -1
      )
    );
    return ({begin, end})
  }

  selectQuater(quarter: number) {
    this.dateRangesChange.emit(this._getQuarterDates(quarter));
  }

  checkQuarterSelected(quarter: number) {
    const { begin, end } = this._getQuarterDates(quarter);
    return (
      this._dateAdapter.sameDate(begin, this.beginDate)
      &&
      this._dateAdapter.sameDate(end, this.endDate)
    );
  }

  onCancel() {
    this._userSelection.emit()
  }
  onApply() {
    this._userSelection.emit({apply: true})
  }
}