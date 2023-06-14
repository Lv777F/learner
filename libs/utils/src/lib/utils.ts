import { map, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { parse } from 'yaml';

export function loadYaml<T>(path: string) {
  return fromFetch(path).pipe(
    switchMap((res) => res.text()),
    map((text) => parse(text) as T)
  );
}
