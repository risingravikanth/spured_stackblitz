import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class JwtService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  getToken(): String {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage['jwtToken'];
    }
  }

  saveToken(token: String) {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage['jwtToken'] = token;
    }
  }

  destroyToken() {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem('jwtToken');
    }
  }

}
