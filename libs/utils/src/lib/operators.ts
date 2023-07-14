import { Observable, filter, map, pairwise, startWith } from 'rxjs';

export function filterBackspace() {
  return (source$: Observable<string>) =>
    source$.pipe(
      startWith(''),
      pairwise(),
      filter(([prev, curr]) => curr.length > prev.length),
      map(([, curr]) => curr),
    );
}
