import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'soles', standalone: true })
export class SolesPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return 'S/ 0.00';
    return `S/ ${value.toFixed(2)}`;
  }
}
