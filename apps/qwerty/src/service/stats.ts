import { inputStat, stats } from '@learner/core';
import { filterBackspace } from '@learner/utils';
import {
  Subject,
  interval,
  map,
  mergeAll,
  scan,
  shareReplay,
  startWith,
  switchAll,
  tap,
  windowToggle,
} from 'rxjs';
import { input$$, word$$ } from './words';

const inputStat$$ = word$$.pipe(
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

const pause$$ = new Subject<void>();

const start$$ = new Subject<void>();

const second$ = interval(1000).pipe(
  windowToggle(start$$.pipe(startWith(null)), () => pause$$),
  mergeAll(),
  scan((acc) => acc + 1, 0)
);

const stats$$ = inputStat$$.pipe(
  map((inputStat$) =>
    inputStat$.pipe(
      stats(second$),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

stats$$.pipe(switchAll()).subscribe();

export { inputStat$$, pause$$, start$$, stats$$ as stats$ };
