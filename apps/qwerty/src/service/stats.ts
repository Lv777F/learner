import { Stats, inputStat, stats } from '@learner/core';
import { filterBackspace } from '@learner/utils';
import { DBSchema, openDB } from 'idb';
import {
  Subject,
  from,
  interval,
  last,
  map,
  scan,
  shareReplay,
  startWith,
  switchAll,
  switchMap,
  take,
  tap,
  windowToggle,
} from 'rxjs';
import { currentDictConfig$ } from './dicts';
import { input$$, word$$ } from './words';

type PracticeRecord = Stats & {
  endTime: number;
  chapter: number;
  chapterSize: number;
  dictName: string;
};

interface RecordDB extends DBSchema {
  practice: {
    key: number;
    value: PracticeRecord;
    indexes: {
      dictName: string;
    };
  };
}

export const recordDB$ = from(
  openDB<RecordDB>('record', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('practice')) {
        db.createObjectStore('practice', { keyPath: 'endTime' }).createIndex(
          'dictName',
          'dictName'
        );
      }
    },
  })
).pipe(shareReplay({ bufferSize: 1, refCount: false }));

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

export function savePracticeRecord(record: PracticeRecord) {
  return recordDB$.pipe(
    take(1),
    switchMap((db) => db.add('practice', record))
  );
}

const practiceRecord$ = stats$$.pipe(
  map((stats$) =>
    stats$.pipe(
      last(),
      switchMap((stats) =>
        currentDictConfig$.pipe(
          take(1),
          map((config) => ({
            ...stats,
            dictName: config.name,
            chapter: config.currentChapter,
            chapterSize: config.chapterSize,
            endTime: new Date().getTime(),
          }))
        )
      )
    )
  ),
  switchAll()
);

practiceRecord$.subscribe((record) => {
  savePracticeRecord(record).subscribe();
});
