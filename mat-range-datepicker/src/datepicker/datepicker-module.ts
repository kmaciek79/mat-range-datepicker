/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {A11yModule} from '@angular/cdk/a11y';
import {OverlayModule} from '@angular/cdk/overlay';
import {PortalModule} from '@angular/cdk/portal';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {SatCalendar, SatCalendarHeader} from './calendar';
import {RangeCalendar} from './range-calendar';
import {SatCalendarBody} from './calendar-body';
import {matRangeDatepicker, matRangeDatepickerContent} from './datepicker';
import {matRangeDatepickerInput} from './datepicker-input';
import {matRangeDatepickerIntl} from './datepicker-intl';
import {matRangeDatepickerToggle, matRangeDatepickerToggleIcon} from './datepicker-toggle';
import {SatMonthView} from './month-view';
import {SatMultiYearView} from './multi-year-view';
import {SatYearView} from './year-view';
import { MAT_DATE_LOCALE } from '../datetime';


@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        OverlayModule,
        A11yModule,
        PortalModule,
    ],
    exports: [
        SatCalendar,
        SatCalendarBody,
        matRangeDatepicker,
        matRangeDatepickerContent,
        matRangeDatepickerInput,
        matRangeDatepickerToggle,
        matRangeDatepickerToggleIcon,
        SatMonthView,
        SatYearView,
        SatMultiYearView,
        SatCalendarHeader,
        RangeCalendar,
    ],
    declarations: [
        SatCalendar,
        SatCalendarBody,
        RangeCalendar,
        matRangeDatepicker,
        matRangeDatepickerContent,
        matRangeDatepickerInput,
        matRangeDatepickerToggle,
        matRangeDatepickerToggleIcon,
        SatMonthView,
        SatYearView,
        SatMultiYearView,
        SatCalendarHeader,
    ],
    providers: [
        matRangeDatepickerIntl,
        {provide: MAT_DATE_LOCALE, useValue: 'pl-PL'},
    ],
    
    entryComponents: [
        matRangeDatepickerContent,
        SatCalendarHeader,
    ]
})
export class MatRangeDatepickerModule {}
