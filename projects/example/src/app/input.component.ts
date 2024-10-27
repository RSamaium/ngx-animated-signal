import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  standalone: true,
  template: `
    <label>
      <code>{{ label }}</code>
      <input
        [value]="value"
        type="range"
        [min]="min"
        [max]="max"
        (input)="setValue($event)"
      />
      <input
        type="number"
        [value]="value"
        [min]="min"
        [max]="max"
        (input)="setValue($event)"
      />
    </label>
  `,
  styles: `
    label {
        display: flex;
        align-items: center;
        gap: 8px;
    }
  `,
})
export class InputComponent {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() min: number = -200;
  @Input() max: number = 200;
  @Output() valueChange = new EventEmitter<number>();

  setValue(event: Event) {
    const newValue = (event.target as HTMLInputElement).value;
    const parsedValue =
      typeof newValue === 'string' ? parseFloat(newValue) || 0 : newValue;
    this.valueChange.emit(parsedValue);
  }
}
