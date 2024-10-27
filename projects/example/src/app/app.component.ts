import { Component, effect } from '@angular/core';
import { animatedSignal, AnimationOptions } from 'ngx-animated-signal';
import { InputComponent } from './input.component';

const animatedOptions: AnimationOptions<number> = {
  duration: 200,
  stiffness: 200,
  type: "spring"
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputComponent],  
  template: `
    <div class="example">
      <div>
        <div
          class="box"
          [style.transform]="getTransform()"
        ></div>
      </div>
      <div class="inputs">
        <app-input [value]="x.state().end" (valueChange)="x.set($event)">x</app-input>
        <app-input [value]="y.state().end" (valueChange)="y.set($event)">y</app-input>
        <app-input
          [value]="rotate.state().end"
          (valueChange)="rotate.set($event)"
          [min]="-180"
          [max]="180"
        >rotate</app-input>
      </div>
    </div>
  `,
})
export class AppComponent {
  x = animatedSignal<number>(0, animatedOptions);
  y = animatedSignal(0, animatedOptions);
  rotate = animatedSignal(0, animatedOptions);

  getTransform() {
    return `translate(${this.x()}px, ${this.y()}px) rotate(${this.rotate()}deg)`;
  }
}
