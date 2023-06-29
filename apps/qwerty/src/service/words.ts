import { replayFrom, stepByStep } from '@learner/core';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  delayWhen,
  distinctUntilChanged,
  filter,
  map,
  merge,
  scan,
  shareReplay,
  skipWhile,
  switchMap,
  tap,
} from 'rxjs';
import { getChapter } from './chapters';
import { getDictConfig } from './configs';
import { Word, checkDictLoaded, currentDict$$ } from './dicts';

export const input$$ = new BehaviorSubject('');
export const jump$$ = new Subject<number>();
export const skip$$ = new Subject<void>();

export const words$ = currentDict$$.pipe(
  delayWhen(checkDictLoaded),
  switchMap((dictName) =>
    getDictConfig(dictName).pipe(
      distinctUntilChanged(
        (prev, curr) =>
          prev.chapterSize === curr.chapterSize &&
          prev.currentChapter === curr.currentChapter
      ),
      debounceTime(200),
      switchMap(({ chapterSize, currentChapter: currentChapter }) =>
        getChapter<Word>(dictName, currentChapter ?? 1, chapterSize)
      )
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

export const pass$$ = new Subject<void>();

export const word$$ = words$.pipe(
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
