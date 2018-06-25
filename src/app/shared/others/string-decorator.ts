
import { AbstractControl } from '@angular/forms';
export class StringDecorator {

     public stringUnifromity(str) {  
        str = str.trim().replace(/ +(?= )/g, '')
        str = str.toLowerCase().split(' ');

        for(var i = 0; i < str.length; i++){
            str[i] = str[i].split('');
            str[i][0] = str[i][0].toUpperCase(); 
            str[i] = str[i].join('');
        }
        return str.join(' ');
        }
    
}