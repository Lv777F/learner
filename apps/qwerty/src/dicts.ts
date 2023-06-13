import { openDB } from "idb";
import { catchError, map, of, shareReplay, switchMap, take } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import YAML from "yaml";

const DICTIONARY_INDEX_PATH = "/dictionaries/index.yaml";

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

export function loadYaml<T>(path: string) {
  return fromFetch(path).pipe(
    switchMap((res) => res.text()),
    map((text) => YAML.parse(text) as T)
  );
}

export const remoteDictionaries$ = loadYaml<{
  version: number;
  dictionaries: Dictionary[];
}>(DICTIONARY_INDEX_PATH).pipe(
  shareReplay({ bufferSize: 1, refCount: false }),
  take(1)
);

export const dictionaryDB$ = remoteDictionaries$.pipe(
  catchError(() => of({ version: undefined, dictionaries: [] })),
  switchMap(({ version, dictionaries }) =>
    openDB("dictionary", version, {
      upgrade(db) {
        if (version) {
          dictionaries.forEach((dict) => {
            if (!db.objectStoreNames.contains(dict.name)) {
              db.createObjectStore(dict.name).createIndex("word", "word", {
                unique: true,
              });
            }
          });
        }
      },
    })
  ),
  shareReplay({ bufferSize: 1, refCount: false }),
  take(1)
);

export function loadRemoteDictionary(name: string) {
  return remoteDictionaries$.pipe(
    map(({ dictionaries }) => dictionaries.find((dict) => dict.name === name)),
    switchMap((dict) => {
      if (dict) return loadYaml<Word[]>(dict.path);
      throw new Error(`Remote dictionary ${name} not found`);
    })
  );
}

export function syncLocalDictionary(name: string) {
  return loadRemoteDictionary(name).pipe(
    switchMap((words) =>
      dictionaryDB$.pipe(
        switchMap(async (db) => {
          const tx = db.transaction(name, "readwrite");
          const store = tx.objectStore(name);
          await store.clear();
          words.forEach((word, i) => store.add(word, i));
          return tx.done;
        })
      )
    )
  );
}

export function getPaginatedItems<T>(
  dictionaryName: string,
  page: number,
  pageSize = 20
) {
  return dictionaryDB$.pipe(
    switchMap(
      (db) =>
        db
          .transaction(dictionaryName, "readonly")
          .objectStore(dictionaryName)
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
