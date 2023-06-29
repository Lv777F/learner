import { replayFrom, stepByStep } from '@learner/core';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  delayWhen,
  filter,
  map,
  merge,
  scan,
  shareReplay,
  skipWhile,
  switchMap,
  tap,
} from 'rxjs';
import { currentChapter$$ } from './chapters';
import { getDictConfig } from './configs';
import { Word, checkDict, currentDict$$, getChapter } from './dicts';

const input$$ = new BehaviorSubject('');
const jump$$ = new Subject<number>();
const skip$$ = new Subject<void>();

const words$ = currentDict$$.pipe(
  delayWhen(checkDict),
  switchMap((dictName) =>
    combineLatest([
      currentChapter$$.pipe(debounceTime(200)),
      getDictConfig(dictName),
    ]).pipe(
      switchMap(([chapter, { chapterSize }]) =>
        getChapter<Word>(dictName, chapter, chapterSize)
      )
    )
  ),
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
