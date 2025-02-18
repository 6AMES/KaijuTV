import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeSource'
})
export class RemoveSourcePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/\s*\(Source:.*?\)\s*$/, '');
  }
}
