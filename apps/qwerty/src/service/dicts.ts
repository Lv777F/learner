import { loadYaml } from '@learner/utils';
import { openDB } from 'idb';
import {
  BehaviorSubject,
  catchError,
  map,
  of,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';

const DICTIONARY_INDEX_PATH = '/dictionaries/index.yaml';

export interface Dictionary {
  name: string;
  language: string;
  meaningLanguage: string;
  count: number;
  description: string;
  path: string;
  lastUpdateTime: Date;
}

export interface Word {
  word: string;
  meanings: string[];
  pronunciation: string;
}

export const currentDict$$ = new BehaviorSubject('CET-4');

export const remoteDicts$ = loadYaml<{
  version: number;
  dictionaries: Dictionary[];
}>(DICTIONARY_INDEX_PATH).pipe(shareReplay({ bufferSize: 1, refCount: true }));

export const dictDB$ = remoteDicts$.pipe(
  catchError(() => of({ version: undefined, dictionaries: [] })),
  switchMap(({ version, dictionaries }) =>
    openDB('dictionary', version, {
      upgrade(db) {
        if (version) {
          dictionaries.forEach((dict) => {
            if (!db.objectStoreNames.contains(dict.name)) {
              db.createObjectStore(dict.name).createIndex('word', 'word', {
                unique: true,
              });
            }
          });
        }
      },
    })
  ),
  shareReplay({ bufferSize: 1, refCount: true })
);

export function loadRemoteDict(name: string) {
  return remoteDicts$.pipe(
    take(1),
    map(({ dictionaries }) => dictionaries.find((dict) => dict.name === name)),
    switchMap((dict) => {
      if (!dict) throw new Error(`Remote dictionary ${name} not found`);
      return loadYaml<Word[]>(dict.path);
    })
  );
}

export function syncLocalDict(name: string) {
  return loadRemoteDict(name).pipe(
    switchMap((words) =>
      dictDB$.pipe(
        take(1),
        switchMap(async (db) => {
          const tx = db.transaction(name, 'readwrite');
          const store = tx.objectStore(name);
          await store.clear();
          words.forEach((word, i) => store.add(word, i));
          return tx.done.then(() => words.length);
        })
      )
    )
  );
}

function getDictCount(name: string) {
  return dictDB$.pipe(
    take(1),
    switchMap((db) => db.count(name))
  );
}

export function checkDictCount(name: string) {
  return getDictCount(name).pipe(
    switchMap((count) => (count > 0 ? of(count) : syncLocalDict(name)))
  );
}
