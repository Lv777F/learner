import { replayFrom, stepByStep } from '@learner/core';
import {
  BehaviorSubject,
  Subject,
  delayWhen,
  filter,
  map,
  merge,
  of,
  scan,
  shareReplay,
  skipWhile,
  switchMap,
  take,
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
const jump$$ = new Subject<number>();
const skip$$ = new Subject<void>();

const words$ = currentDict$$.pipe(
  delayWhen((dictName) =>
    dictDB$.pipe(
      take(1),
      switchMap((db) => db.count(dictName)),
      switchMap((count) => (count > 0 ? of(0) : syncLocalDict(dictName)))
    )
  ),
  switchMap((dictName) => getPaginatedItems<Word>(dictName, 0, 2)),
  shareReplay({ bufferSize: 1, refCount: true })
);

const pass$$ = new Subject<void>();

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
              input$$.next('');
            }),
            scan((acc) => acc + 1, 0),
            skipWhile((passCount) => passCount < 3)
          ),
          skip$$
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

export const pass$ = pass$$.asObservable();

export { input$$, jump$$, skip$$, word$$, words$ };
