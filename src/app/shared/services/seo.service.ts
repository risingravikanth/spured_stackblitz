import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private meta: Meta) { }

  generateTags(config) {
    // default values
    config = { 
      title: 'Noticer', 
      description: 'All about the students communication and competitive examinations. &copy; 2018 Noticer', 
      image: 'assets/images/favicon.ico',
      slug: '',
      ...config
    }

    this.meta.updateTag({ property: 'og:type', content: 'artical' });
    this.meta.updateTag({ property: 'og:site', content: 'Noticer' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image });
  }

}