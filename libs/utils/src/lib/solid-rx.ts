import { Observable, Subject, takeUntil } from 'rxjs';
import { onCleanup } from 'solid-js';

export function takeUntilCleanUp<T>() {
  const subj = new Subject<void>();
  onCleanup(() => {
    subj.next();
    subj.complete();
  });
  return (source$: Observable<T>) => source$.pipe(takeUntil(subj));
}
