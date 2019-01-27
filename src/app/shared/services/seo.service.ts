import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable()
export class SeoService {

  constructor(private meta: Meta) { }

  generateTags(config) {
    // default values
    config = { 
      title: 'SpurEd - Spur: Give encouragement to Ed: Education', 
      description: 'A place where you can be updated anything related to education, exams, career, events, news, current affairs etc.Boards helps you connect with fellow students at your college or educational institutes.', 
      image: 'https://s3.ap-south-1.amazonaws.com/imgposts/files/84-227380096141796-21508154-back-to-school-global-icons-education-text-over-paper-sheet-background-.jpg',
      ...config
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:site', content: '@angularfirebase' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image });

    this.meta.updateTag({ property: 'og:type', content: 'artical' });
    this.meta.updateTag({ property: 'og:site', content: 'Spured' });
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    // this.meta.updateTag({ property: 'og:image', content: config.image });
  }

}