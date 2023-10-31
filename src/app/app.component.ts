import { DatePipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
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
export class AppComponent {
  title = 'pregnancy-week';

  pregnancyWeeks = new Array<PregnancyWeek>();
  icons: string[] = [
    '&#x1F476;',
    '&#x1F423;',
    '&#x1F37C;',
    '&#x1F385;',
    '&#x1F383;',
    '&#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;',
  ];
  constructor() {
    let startOffset = 8;
    let startDate = new Date(2023, 9, 19);
    const today = this.addDate(new Date(), 4 * 7);

    while (startDate < today) {
      const pregnancyWeek = new PregnancyWeek();
      pregnancyWeek.date = startDate;
      pregnancyWeek.weekNo = startOffset;
      this.pregnancyWeeks.push(pregnancyWeek);

      startDate = this.addDate(startDate, 7);
      startOffset++;
    }
  }

  addDate(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }
}

export class PregnancyWeek {
  date: Date | undefined;
  weekNo: number | undefined;
}
