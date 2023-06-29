import { BehaviorSubject, combineLatest, map, switchMap, take } from 'rxjs';
import { getDictConfig } from './configs';
import { checkDict, currentDict$$, dictDB$ } from './dicts';

// TODO store in every dict
export const currentChapter$$ = new BehaviorSubject(0);

currentDict$$.subscribe(() => currentChapter$$.next(0));

export function getChapters(name: string) {
  return combineLatest([checkDict(name), getDictConfig(name)]).pipe(
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
        db
          .transaction(name, 'readonly')
          .objectStore(name)
          .getAll(
            IDBKeyRange.bound(
              page * pageSize,
              (page + 1) * pageSize,
              false,
              true
            )
          ) as Promise<T[]>
    )
  );
}
