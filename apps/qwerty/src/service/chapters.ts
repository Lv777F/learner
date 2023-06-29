import { combineLatest, map, switchMap, take } from 'rxjs';
import { getDictConfig } from './configs';
import { checkDictCount, dictDB$ } from './dicts';

export function getChapters(name: string) {
  return combineLatest([checkDictCount(name), getDictConfig(name)]).pipe(
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
