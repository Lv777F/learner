import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

export function toSignal<T>(
  input$: Observable<T>,
  defaultValue?: T,
  cleanup$ = (() => {
    const subj = new Subject<void>();
    onCleanup(() => {
      subj.next();
      subj.complete();
    });
    return subj.asObservable();
  })()
) {
  const [value, setValue] = createSignal<T>(defaultValue as T);

  input$.pipe(takeUntil(cleanup$)).subscribe(setValue);

  return [value, setValue];
}

export function toRx<T>(value: Accessor<T>) {
  const rsubj = new ReplaySubject<T>();
  createEffect(() => {
    rsubj.next(value());
  });
  onCleanup(() => {
    rsubj.complete();
  });
  return rsubj.asObservable();
}
