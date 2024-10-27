import { signal, Signal } from "@angular/core";
import { animate as animatePopmotion, AnimationOptions } from "popmotion";

export interface AnimatedState<T> {
    current: T;
    start: T;
    end: T;
}

export interface AnimatedSignal<T> {
    (): T;
    update: (updater: (value: T) => T) => void;
    set: (newValue: T) => void;
    state: Signal<AnimatedState<T>>;
}

export function animatedSignal<T>(initialValue: T, options: AnimationOptions<T> = {}): AnimatedSignal<T> {
    let state: AnimatedState<T> = {
        current: initialValue,
        start: initialValue,
        end: initialValue,
    };
    let animation: any

    const currentState = signal(state);

    function animatedSignal(): AnimatedState<T>;
    function animatedSignal(newValue: T): void;
    function animatedSignal(newValue?: T): AnimatedState<T> | void {
        if (newValue === undefined) {
            return currentState();
        }

        const prevState = currentState();

        currentState.update(state => ({ ...state, end: newValue }));

        if (animation) {
            animation.stop();
        }

        animation = animatePopmotion({
            duration: 1000,
            ...options,
            from: prevState.current,
            to: newValue,
            onUpdate: (value) => {
                currentState.update(state => ({ ...state, current: value as T }));
                if (options.onUpdate) {
                    options.onUpdate(value as T);
                }
            },
        });
    }

    const fn = function () {
        return currentState().current
    }

    fn.update = (updater: (value: T) => any) => {
        animatedSignal(updater(currentState().current));
    }
    fn.set = (newValue: T) => {
        animatedSignal(newValue);
    }

    fn.state = currentState

    return fn as AnimatedSignal<T>
}
