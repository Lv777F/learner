import { inputStat, stats } from '@learner/core';
import { filterBackspace } from '@learner/utils';
import {
  Subject,
  interval,
  map,
  scan,
  shareReplay,
  startWith,
  switchAll,
  tap,
  windowToggle,
} from 'rxjs';
import { input$$, word$$ } from './words';

export const inputStat$$ = word$$.pipe(
  map((words$) =>
    words$.pipe(
      inputStat(({ word }) =>
        input$$.pipe(
          filterBackspace(),
          map((input) => word.startsWith(input)),
          tap((correct) => {
            if (!correct) {
              input$$.next('');
            }
          })
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

export const pause$$ = new Subject<void>();

export const start$$ = new Subject<void>();

const second$ = interval(1000).pipe(
  windowToggle(start$$, () => pause$$),
  switchAll(),
  scan((acc) => acc + 1, 0)
);

export const stats$$ = inputStat$$.pipe(
  map((inputStat$) =>
    inputStat$.pipe(
      startWith({
        correct: 0,
        incorrect: 0,
      }),
      stats(second$),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);
