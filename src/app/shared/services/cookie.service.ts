import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
 

import { CookiesService, CookiesOptions } from '@ngx-utils/cookies';
import { environment } from '../../../environments/environment';

@Injectable()
export class CustomCookieService {

  constructor(private cookies: CookiesService) { }



  saveTrackId(trackid: string) {
    let cookieOptions: CookiesOptions = { domain: environment.domain };
    this.cookies.put('tracking_id', trackid, cookieOptions);
  }

  getTrackId() {
      return this.cookies.get('tracking_id');
  }

  removeCookie(Key: any) {
      this.cookies.remove(Key);
  }

  destroyTrackId() {
      this.cookies.removeAll();
  }

  isTrackIdAvailable(): boolean {
     return false;
  }

}
