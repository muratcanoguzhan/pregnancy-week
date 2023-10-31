import { DatePipe, NgFor } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet } from '@angular/router';
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
  ],
})
export class AppComponent implements OnDestroy {
  title = 'pregnancy-week';

  color = signal('primary');
  pregnancyWeeks = new Array<PregnancyWeek>();
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
  constructor() {
    //let startDate = new Date(2023, 7, 23);//actual date
    let startDate = new Date(2023, 7, 24, 0, 0, 0);
    let endDate = this.addDate(startDate, 6, true);
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const pregnancyWeek = new PregnancyWeek();
      pregnancyWeek.startDate = startDate;
      pregnancyWeek.endDate = endDate;
      pregnancyWeek.weekNo = i + 1;

      if (
        startDate.getTime() <= today.getTime() &&
        today.getTime() <= endDate.getTime()
      ) {
        debugger;
        pregnancyWeek.isCurrentWeek = true;
      }
      this.pregnancyWeeks.push(pregnancyWeek);

      startDate = this.addDate(endDate, 1);
      endDate = this.addDate(startDate, 6);
    }

    this.interval = window.setInterval(() => {
      const index = this.colors.findIndex((c) => c == this.color());
      this.color.set(this.colors[(index + 1) % this.colors.length]);
    }, 850);
  }
  ngOnDestroy(): void {
    window.clearInterval(this.interval);
  }

  addDate(date: Date, days: number, endOfTheDateTime: boolean = false): Date {
    if (endOfTheDateTime) {
      return new Date(
        date.getTime() +
          days * 24 * 60 * 60 * 1000 +
          (23 * 60 * 60 * 1000 + 9999)
      );
    } else {
      return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    }
  }
}

export class PregnancyWeek {
  startDate: Date | undefined;
  endDate: Date | undefined;
  weekNo: number | undefined;
  isCurrentWeek: boolean = false;
}
