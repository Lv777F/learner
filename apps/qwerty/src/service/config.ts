import { DBSchema, openDB } from 'idb';
import { from, shareReplay } from 'rxjs';

export interface DictConfig {
  repeatCount: number;
  chapterSize: number;
  shuffle: boolean;
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
