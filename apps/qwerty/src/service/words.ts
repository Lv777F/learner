import { replayFrom, stepByStep } from '@learner/core';
import {
  BehaviorSubject,
  Subject,
  debounceTime,
  delayWhen,
  distinctUntilKeyChanged,
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
import { Word, checkDictLoaded, currentDictConfig$ } from './dicts';

export const input$$ = new BehaviorSubject('');
export const jump$$ = new Subject<number>();
export const skip$$ = new Subject<void>();

export const words$ = currentDictConfig$.pipe(
  delayWhen(({ name }) => checkDictLoaded(name)),
  distinctUntilKeyChanged('currentChapter'),
  debounceTime(200),
  switchMap(({ chapterSize, currentChapter, name }) =>
    getChapter<Word>(name, currentChapter ?? 1, chapterSize)
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

export const word$$ = words$.pipe(
  replayFrom(jump$$),
  map((word$) =>
    word$.pipe(
      stepByStep(({ word }) =>
        merge(
          input$$.pipe(
            filter((input) => word === input),
            tap(() => {
              input$$.next('');
            }),
            scan((acc) => acc + 1, 0),
            skipWhile((passCount) => passCount < 1)
          ),
          skip$$
        )
      ),
      shareReplay({ bufferSize: 1, refCount: true })
    )
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);
