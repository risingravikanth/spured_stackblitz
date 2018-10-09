import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
 name: 'parseUrl'

})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
 transform(items: any[], field: string, value: string): any[] {
   let query = value.toLowerCase();
   if (!items) return [];
   else if(value == ""){
       return items;
   } else
  //  return items.filter(it => it[field] == value);
   return (items || []).filter((item) => field.split(',').some(key => item.hasOwnProperty(key) && new RegExp(value, 'gi').test(item[key])));
 }
}



