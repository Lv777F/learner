import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatestWith,
  concatMap,
  connect,
  finalize,
  from,
  last,
  map,
  startWith,
  switchMap,
  switchScan,
  takeUntil,
} from 'rxjs';

export function stepByStep<T>(notifier: (item: T) => Observable<unknown>) {
  return (item$: Observable<T>) =>
    item$.pipe(
      concatMap((item) =>
        new BehaviorSubject(item).pipe(takeUntil(notifier(item)))
      )
    );
}

export function replayFrom<T>(notifier$: Observable<number>) {
  const finish$$ = new Subject<void>();
  return (items$: Observable<T[]>) =>
    items$.pipe(
      map((items) =>
        notifier$.pipe(
          startWith(0),
          switchMap((i) =>
            from(items.slice(i)).pipe(
              connect((sharedItem$) => {
                const finish_ = sharedItem$.pipe(last()).subscribe(() => {
                  finish$$.next();
                });
                return sharedItem$.pipe(
                  finalize(() => {
                    finish_.unsubscribe();
                  })
                );
              })
            )
          ),
          takeUntil(finish$$)
        )
      )
    );
}

export interface InputStat {
  correct: number;
  incorrect: number;
}

export function inputStat<T>(validFn: (item: T) => Observable<boolean>) {
  return (source$: Observable<T>) =>
    source$.pipe(
      connect((sharedSource$) =>
        sharedSource$.pipe(
          switchScan(
            (stat, item) =>
              validFn(item).pipe(
                map((valid) => {
                  if (valid) {
                    stat.correct++;
                  } else {
                    stat.incorrect++;
                  }
                  return stat;
                })
              ),
            { correct: 0, incorrect: 0 } as InputStat
          ),
          takeUntil(sharedSource$.pipe(last()))
        )
      )
    );
}

export interface Stats {
  wpm: number;
  totalInputCount: number;
  correctInputCount: number;
  incorrectInputCount: number;
  correctRate: number;
  second: number;
}

export function stats(second$: Observable<number>) {
  return (source$: Observable<InputStat>) =>
    source$.pipe(
      connect((sharedSource$) =>
        sharedSource$.pipe(
          combineLatestWith(second$),
          map(([{ correct, incorrect }, second]) => {
            const totalInputCount = correct + incorrect;
            return {
              correctInputCount: correct,
              incorrectInputCount: incorrect,
              totalInputCount,
              wpm: Math.floor(correct / 5 / ((second || 0.5) / 60)),
              correctRate: correct / totalInputCount,
              second,
            } as Stats;
          }),
          takeUntil(sharedSource$.pipe(last()))
        )
      )
    );
}
