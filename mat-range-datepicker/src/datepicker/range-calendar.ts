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
}