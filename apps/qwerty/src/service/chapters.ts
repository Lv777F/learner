import {
  combineLatest,
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';
import { getDictConfig } from './configs';
import { checkDictLoaded, currentDictConfig$, dictDB$ } from './dicts';

export const currentChapter$ = currentDictConfig$.pipe(
  map(({ currentChapter }) => currentChapter),
  distinctUntilChanged(),
  shareReplay({ bufferSize: 1, refCount: true })
);

export function getChapters(name: string) {
  return combineLatest([checkDictLoaded(name), getDictConfig(name)]).pipe(
    map(([total, { chapterSize }]) =>
      Array.from({ length: Math.ceil(total / chapterSize) }, (_, i) => i)
    )
  );
}

export function getChapter<T>(name: string, page: number, pageSize = 20) {
  return dictDB$.pipe(
    take(1),
    switchMap(
      (db) =>
        db.getAll(
          name,
          IDBKeyRange.bound(page * pageSize, (page + 1) * pageSize, false, true)
        ) as Promise<T[]>
    )
  );
}
