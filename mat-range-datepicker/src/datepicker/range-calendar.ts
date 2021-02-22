/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { ComponentPortal, ComponentType, Portal } from '@angular/cdk/portal';
import {
    AfterContentInit,
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { createMissingDateImplError } from './datepicker-errors';
import { matRangeDatepickerIntl } from './datepicker-intl';
import { SatMonthView } from './month-view';
import { SatMultiYearView, yearsPerPage } from './multi-year-view';
import { SatYearView } from './year-view';

import { matRangeDatepickerRangeValue } from './datepicker-input';
import { DateAdapter } from '../datetime/date-adapter';
import { MAT_DATE_FORMATS, MatDateFormats } from '../datetime/date-formats';
import { SatCalendarCell } from './calendar-body';

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
export class RangeCalendar<D> implements OnInit {
    @Input() id: any;
    @Input() showQuartersAndMonths: boolean = false;
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
    _years: any = [];
    _selectedMonths: any = [];
    _selectedQuarters: any = [];
    _todayYear: number;
    activeYear: any;
    activeMonth: any;
    activeQuarter: any;
    _rangeIsSet: boolean = false;
    _rangeQuarterIsSet: boolean = false;
    _todayDate: Date = new Date();
    _todayMonth: number = this._todayDate.getMonth();
    private _activeDate: D;
    private _beginDateSelected = false;
    @ViewChild('year') yearSel: ElementRef;

    _months = ["Sty", "Lut", "Mar", "Kwi", "Maj", "Cze", "Lip", "Sie", "Wrz", "Paź", "Lis", "Gru"];

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

    _reset() {
        this.beginDate = this.endDate = null;
    }

    ngOnInit() {

        this._activeDate = this._dateAdapter.today();
        this._todayYear = this._dateAdapter.getYear(this._dateAdapter.today());
        this.activeYear = this._dateAdapter.getYear(this._activeDate);

        let activeOffset = this.activeYear % yearsPerPage;
        let yearsPerRow = 24;
        for (let i = 0; i < 10; i++) {
            this._years.push(this.activeYear - activeOffset + i);
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
                    this.dateRangesChange.emit({ begin: <D>this.beginDate, end: date });
                } else {
                    this.dateRangesChange.emit({ begin: date, end: <D>this.beginDate });
                }
            }
        } else if (!this._dateAdapter.sameDate(date, this.selected)) {
            this.selectedChange.emit(date);
        }
        this.activeMonth = this.activeYear = null;
    }

    _getQuarterDates(quarter: number) {

        // console.log(this.activeYear);
        // console.log(quarter);

        const _year = this._dateAdapter.getYear(this._dateAdapter.today());
        const begin = this._dateAdapter.createDate(this.activeYear, (quarter - 1) * 3, 1);
        const end = (
            quarter === 4
                ?
                this._dateAdapter.addCalendarDays(
                    this._dateAdapter.createDate(this.activeYear + 1, 0, 1),
                    -1
                )
                :
                this._dateAdapter.addCalendarDays(
                    this._dateAdapter.createDate(this.activeYear, quarter * 3, 1),
                    -1
                )
        );
        return ({ begin, end })
    }



    _getMonthDates(month: number) {
        const daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(this.activeYear, month, 1));
        const begin = this._dateAdapter.createDate(this.activeYear, month, 1);
        const end = this._dateAdapter.createDate(this.activeYear, month, daysInMonth);
        return ({ begin, end })
    }


    selectYearA(year) {
        this.activeYear = year;
        this._reset();
    }


    selectYear($event) {
        this._reset();
        this.activeYear = $event.srcElement.attributes.year.value;
        this.activeMonth = this.activeQuarter = null;
        this._selectedQuarters = this._selectedMonths =  [];
    }

    selectYearB($event) {
        this._reset();
        this.activeYear = $event.target.value;
        this.activeMonth = this.activeQuarter = null;
        this._selectedQuarters = this._selectedMonths =  [];
    }

    selectMonth($event) {

        if (!!this.activeQuarter) {
            this.activeQuarter = null;
            this._rangeQuarterIsSet = false;
            this._selectedQuarters = [];
            this.activeMonth = null;
            this._rangeIsSet = true;
        }


        if (this._rangeIsSet) {
            this._selectedMonths = [];
            this.activeMonth = parseInt($event.srcElement.attributes.month.value);
            this.dateRangesChange.emit(this._getMonthDates($event.srcElement.attributes.month.value));
            this._rangeIsSet = false;
        }

        else {

            if ($event.srcElement.attributes.month.value < this.activeMonth) {
                for (let i = $event.srcElement.attributes.month.value; i <= this.activeMonth; i++) {
                    this._selectedMonths.push(parseInt(i));
                }
            }
            else {
                for (let i = this.activeMonth; i <= $event.srcElement.attributes.month.value; i++) {
                    this._selectedMonths.push(parseInt(i));
                }
            }

            this.activeMonth = parseInt($event.srcElement.attributes.month.value);

            if (this._selectedMonths.length > 0) {

                let firstMonthDate = this._getMonthDates(this._selectedMonths[0]);
                let lastMonthDate = this._getMonthDates(this._selectedMonths[this._selectedMonths.length - 1]);
                this.dateRangesChange.emit({ 'begin': firstMonthDate['begin'], 'end': lastMonthDate['end'] });
                this._rangeIsSet = true;
            }
            else {
                this.dateRangesChange.emit(this._getMonthDates($event.srcElement.attributes.month.value));
            }
        }
    }

    selectQuater(quarter: number) {

        this.activeMonth = null;
        this._rangeIsSet = false;
        this._selectedMonths = [];

        if (this._rangeQuarterIsSet) {
            this._selectedQuarters = [];
            this.activeQuarter = quarter;
            this.dateRangesChange.emit(this._getQuarterDates(quarter));
            this._rangeQuarterIsSet = false;
        }
        else {
            if (!!this.activeQuarter) {
                if (quarter < this.activeQuarter) {
                    for (let i = quarter; i <= this.activeQuarter; i++) {
                        this._selectedQuarters.push(i);
                    }
                }
                else {

                    for (let i = this.activeQuarter; i <= quarter; i++) {
                        this._selectedQuarters.push(parseInt(i));
                    }
                }
            }

            this.activeQuarter = quarter;

            if (this._selectedQuarters.length > 0) {
                let firstQDate = this._getQuarterDates(this._selectedQuarters[0]);
                let lastQDate = this._getQuarterDates(this._selectedQuarters[this._selectedQuarters.length - 1]);
                this.dateRangesChange.emit({ 'begin': firstQDate['begin'], 'end': lastQDate['end'] });
                this._rangeQuarterIsSet = true;
            }
            else {
                this.dateRangesChange.emit(this._getQuarterDates(quarter));
            }
        }
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
        this._userSelection.emit({ apply: true })
    }
}