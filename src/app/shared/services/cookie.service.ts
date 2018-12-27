import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CustomCookieService {

  constructor(private cookieService: CookieService) { }

  getTrackId(): string {
    return this.cookieService.get('tracking-id');
  }

  saveTrackId(trackid: string) {
    let expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 7);
    trackid = '939';
    this.cookieService.set('tracking-id', trackid, expiredDate);
  }

  destroyTrackId() {
    this.cookieService.deleteAll();
  }

  isTrackIdAvailable(): boolean {
    return this.cookieService.check("tracking-id");
  }

}
