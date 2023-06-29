import { DBSchema, openDB } from 'idb';
import { from, map, shareReplay, switchMap, take } from 'rxjs';

export interface DictConfig {
  repeatCount: number;
  chapterSize: number;
  shuffle: boolean;
  currentChapter?: number;
}

interface ConfigDB extends DBSchema {
  dictionary: {
    key: string;
    value: DictConfig;
  };
}

export const configDB$ = from(
  openDB<ConfigDB>('config', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('dictionary')) {
        db.createObjectStore('dictionary', { keyPath: 'dictName' });
      }
    },
  })
).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: true,
  })
);

const DEFAULT_DICT_CONFIG: DictConfig = {
  chapterSize: 20,
  repeatCount: 1,
  shuffle: false,
  currentChapter: 1,
};

export function getDictConfig(dictName: string) {
  return configDB$.pipe(
    take(1),
    switchMap((db) => db.get('dictionary', dictName)),
    map((customConfig) => Object.assign({}, DEFAULT_DICT_CONFIG, customConfig))
  );
}
