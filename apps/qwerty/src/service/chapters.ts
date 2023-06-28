import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { getDictConfig } from './configs';
import { currentDict$$, getDictCount } from './dicts';

// TODO store in every dict
export const currentChapter$$ = new BehaviorSubject(0);

currentDict$$.subscribe(() => currentChapter$$.next(0));

export function getChapters(name: string) {
  return combineLatest([getDictCount(name), getDictConfig(name)]).pipe(
    map(([total, { chapterSize }]) =>
      Array.from({ length: Math.ceil(total / chapterSize) }, (_, i) => i)
    )
  );
}
