import { replayFrom, stepByStep } from '@learner/core';
import {
  BehaviorSubject,
  Subject,
  bufferCount,
  delayWhen,
  filter,
  map,
  merge,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  Word,
  currentDict$$,
  dictDB$,
  getPaginatedItems,
  syncLocalDict,
} from './dicts';

const input$$ = new BehaviorSubject('');

const pass$$ = new Subject<void>();
const pass$ = pass$$.asObservable();
const jump$$ = new Subject<number>();
const skip$$ = new Subject<void>();

const words$ = currentDict$$.pipe(
  delayWhen((dictName) =>
    dictDB$.pipe(
      switchMap((db) => db.count(dictName)),
      switchMap((count) => (count > 0 ? of(0) : syncLocalDict(dictName)))
    )
  ),
  switchMap((dictName) => getPaginatedItems<Word>(dictName, 0, 10)),
  shareReplay({ refCount: true, bufferSize: 1 })
);

const word$$ = words$.pipe(
  replayFrom(jump$$),
  map((word$) =>
    word$.pipe(
      stepByStep(({ word }) =>
        merge(
          input$$.pipe(
            filter((input) => word === input),
            tap(() => {
              pass$$.next();
            }),
            bufferCount(1)
          ),
          skip$$
        )
      )
    )
  )
);

export { input$$, jump$$, pass$, skip$$, word$$, words$ };
