# Angular Animated Signal

AnimatedSignal is a lightweight library that provides an easy way to animate low-level operations using Angular signals. It offers a simple and efficient approach to create smooth transitions and animations for your Angular applications.

This library bridges the gap between Angular's reactive programming model and animation capabilities, allowing developers to easily incorporate fluid, state-based animations into their projects without complex setup or external dependencies.

It is based on the PopMotion library, which is lightweight and can produce complex animations.

## Features

- Simple API: Provides a straightforward `animatedSignal` function for easy implementation
- Seamless integration with Angular signals: Works flawlessly with Angular's `computed`, `effect`, `toObservable`, and other signal-related features
- Powered by PopMotion: Leverages the robust animation capabilities of the PopMotion library
- Low-level control: Offers fine-grained control over animations while maintaining a simple interface
- Flexible: Can be used for various animation scenarios, from simple transitions to complex, multi-step animations
- SSR compatible

## Compatibility

This library is compatible with Angular 16 and above.

## Installation

```bash
npm install ngx-animated-signal
```

## Usage

### Component Example

```typescript
import { Component } from '@angular/core';
import { animatedSignal } from 'ngx-animated-signal';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <h2>{{ count() }}</h2>
      <button (click)="increment()">Increment</button>
      <button (click)="reset()">Reset</button>
    </div>
  `,
})
export class CounterComponent {
  count = animatedSignal(0);

  increment() {
    this.count.update(latest => latest + 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

### With Custom Animation Options

```typescript
import { Component } from '@angular/core';
import { animatedSignal, AnimationOptions } from 'ngx-animated-signal';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div class="counter">
      <h2>{{ count() }}</h2>
      <button (click)="increment()">Increment</button>
      <button (click)="reset()">Reset</button>
    </div>
  `,
})
export class CounterComponent {
  // Define custom animation options
  // options are the same as the ones from popmotion (https://popmotion.io/)
  private animationOptions: AnimationOptions = {
    duration: 800,
    easing: 'easeOut',
    type: 'spring',
    stiffness: 100,
    damping: 10
  };

  count = animatedSignal(0, this.animationOptions);

  increment() {
    this.count.update(latest => latest + 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

### Complete Example

```typescript
import { Component, computed, effect } from '@angular/core';
import { animatedSignal } from 'ngx-animated-signal';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  template: `
    <div class="progress-container">
      <!-- Display current progress -->
      <div class="progress-bar" [style.width.%]="progress()"></div>
      
      <!-- Display animation state information -->
      <div class="status">
        Current: {{ animationState().current.toFixed(1) }}%
        Target: {{ animationState().end.toFixed(1) }}%
      </div>
      
      <!-- Controls -->
      <div class="controls">
        <button (click)="increment()">Add 20%</button>
        <button (click)="stopAnimation()">Stop Animation</button>
        <button (click)="reset()">Reset</button>
      </div>
    </div>
  `,
  styles: [`
    .progress-container {
      width: 300px;
      height: 20px;
      border: 1px solid #ccc;
    }
    .progress-bar {
      height: 100%;
      background: #4CAF50;
      transition: width 0.1s linear;
    }
  `]
})
export class ProgressBarComponent {
  // Create animated signal with custom spring animation
  progress = animatedSignal(0, {
    type: 'spring',
    stiffness: 100,
    damping: 10,
    mass: 1
  });

  // Access the full animation state
  animationState = this.progress.state;

  // Setup an effect to log animation progress
  constructor() {
    effect(() => {
      const state = this.animationState();
      console.log(`Animating from ${state.start}% to ${state.end}%`);
    });
  }

  increment() {
    this.progress.update(current => Math.min(current + 20, 100));
  }

  stopAnimation() {
    this.progress.stop();
  }

  reset() {
    this.progress.set(0);
  }
}
```

This example demonstrates:
- Creating an animated progress bar with spring physics
- Accessing and displaying the animation state
- Using the `stop()` method to interrupt animations
- Setting up an effect to monitor animation changes
- Implementing basic controls for user interaction

## API


### AnimatedSignal<T>

The `AnimatedSignal<T>` is the main interface returned by the `animatedSignal` function. It has the following properties and methods:

- `(): T` - Calling the signal as a function returns the current value.
- `update(updater: (value: T) => T): void` - Updates the signal value using an updater function.
- `set(newValue: T): void` - Sets a new value for the signal.
- `state: Signal<AnimatedState<T>>` - Provides access to the full state of the animation.

### AnimatedState<T>

The `AnimatedState<T>` interface represents the full state of an animated signal:

- `current: T` - The current value of the animation.
- `start: T` - The starting value of the animation.
- `end: T` - The target value of the animation.

You can access these values using the `state` property of the `AnimatedSignal`:

```typescript
const x = animatedSignal(0);
const state = x.state();

console.log(state.current, state.start, state.end);
```

## License

This project is licensed under the MIT License.

