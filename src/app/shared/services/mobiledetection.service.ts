import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class MobileDetectionService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  isMobile(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
      ) {
        return true;
      }
      else {
        return false;
      }
    }
    return false;
  }

}
