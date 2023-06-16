import { inputStat, stats } from '@learner/core';
import { filterBackspace } from '@learner/utils';
import {
  Subject,
  interval,
  map,
  mergeAll,
  scan,
  startWith,
  windowToggle,
} from 'rxjs';
import { input$$, word$$ } from './words';

const inputStat$$ = word$$.pipe(
  map((words$) =>
    words$.pipe(
      inputStat(({ word }) =>
        input$$.pipe(
          filterBackspace(),
          map((input) => word.startsWith(input))
        )
      )
    )
  )
);

const pause$$ = new Subject<void>();

const start$$ = new Subject<void>();

const second$ = interval(1000).pipe(
  windowToggle(start$$.pipe(startWith(null)), () => pause$$),
  mergeAll(),
  scan((acc) => acc + 1, 0)
);

const stats$ = inputStat$$.pipe(
  map((inputStat$) => inputStat$.pipe(stats(second$)))
);

export { inputStat$$, pause$$, start$$, stats$ };
