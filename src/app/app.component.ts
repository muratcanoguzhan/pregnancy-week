import { DatePipe, NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  signal,
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    RouterOutlet,
    DatePipe,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnDestroy, AfterViewInit {
  title = 'pregnancy-week';

  color = signal('primary');
  pregnancyWeeks = signal(new Array<PregnancyWeek>());
  icons: string[] = [
    '&#x1F476;',
    '&#x1F423;',
    '&#x1F37C;',
    '&#x1F385;',
    '&#x1F383;',
    '&#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;',
  ];
  colors = [
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ];

  interval: number;
  startDate = new Date(2023, 7, 23, 0, 0, 0);
  constructor() {
    //let startDate = new Date(2023, 7, 23);//actual date
    this.reGeneratePregnancyWeeks(this.startDate);

    this.interval = window.setInterval(() => {
      const index = this.colors.findIndex((c) => c == this.color());
      this.color.set(this.colors[(index + 1) % this.colors.length]);
    }, 850);
  }
  ngAfterViewInit(): void {
    const id = this.pregnancyWeeks().find((pw) => pw.isCurrentWeek)?.id!;
    const element = document.getElementById(id)!;
    const rect = element.getBoundingClientRect();

    window.scrollTo({
      top: rect.top,
      left: rect.left,
      behavior: 'smooth',
    });
  }

  private getPregnancyWeeks(startDate: Date, endDate: Date, today: Date) {
    let pregnancyWeeks = new Array<PregnancyWeek>();
    for (let i = 0; i < 42; i++) {
      const pregnancyWeek = new PregnancyWeek();
      pregnancyWeek.startDate = startDate;
      pregnancyWeek.endDate = endDate;
      pregnancyWeek.weekNo = i + 1;
      pregnancyWeek.id = `${pregnancyWeek.weekNo}FocusMe`;

      if (
        startDate.getTime() <= today.getTime() &&
        today.getTime() <= endDate.getTime()
      ) {
        pregnancyWeek.isCurrentWeek = true;
      }

      pregnancyWeeks.push(pregnancyWeek);

      startDate = this.addDate(
        new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
        1
      );
      endDate = this.addDate(startDate, 6, true);
    }
    return pregnancyWeeks;
  }

  addDate(date: Date, days: number, endOfTheDateTime: boolean = false): Date {
    if (endOfTheDateTime) {
      const endOfDate = new Date(date.getTime());
      endOfDate.setHours(days * 24 + 23);
      endOfDate.setMinutes(59);
      endOfDate.setSeconds(59);
      endOfDate.setMilliseconds(999);
      return endOfDate;
    } else {
      const startDate = new Date(date.getTime());
      startDate.setHours(days * 24);
      return startDate;
    }
  }

  reGeneratePregnancyWeeks(startDate: MatDatepickerInputEvent<Date> | Date) {
    debugger;
    if (startDate instanceof Date) {
      this.startDate = startDate;
    } else if (startDate instanceof MatDatepickerInputEvent) {
      this.startDate = startDate.value!;
    }

    const nextDayOfStartDate = new Date(this.startDate.getTime());
    nextDayOfStartDate.setHours(24);

    let endDate = this.addDate(nextDayOfStartDate, 6, true);
    const today = new Date();
    this.pregnancyWeeks.set(
      this.getPregnancyWeeks(nextDayOfStartDate, endDate, today)
    );
  }

  ngOnDestroy(): void {
    window.clearInterval(this.interval);
  }
}

export class PregnancyWeek {
  id: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  weekNo: number | undefined;
  isCurrentWeek: boolean = false;
}
