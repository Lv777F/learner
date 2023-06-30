import { DBSchema, openDB } from 'idb';

import {
  Observable,
  ReplaySubject,
  from,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs';

export interface DictConfig {
  name: string;
  repeatCount: number;
  chapterSize: number;
  shuffle: boolean;
  currentChapter: number;
}

interface ConfigDB extends DBSchema {
  dictionary: {
    key: string;
    value: Partial<DictConfig>;
  };
}

export const configDB$ = from(
  openDB<ConfigDB>('config', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('dictionary')) {
        db.createObjectStore('dictionary', { keyPath: 'name' });
      }
    },
  })
).pipe(
  shareReplay({
    bufferSize: 1,
    refCount: false,
  })
);

const globalDictConfig: Omit<DictConfig, 'name'> = {
  chapterSize: 20,
  repeatCount: 1,
  shuffle: false,
  currentChapter: 0,
};

const dictConfigMap = new Map<
  string,
  ReplaySubject<Partial<DictConfig> | undefined>
>();

function getRealDictConfig(name: string) {
  return configDB$.pipe(
    take(1),
    switchMap((db) => {
      if (!dictConfigMap.has(name)) {
        const rsubj = new ReplaySubject<Partial<DictConfig> | undefined>();
        dictConfigMap.set(name, rsubj);
        db.get('dictionary', name).then((config) => {
          rsubj.next(config);
        });
        return rsubj;
      } else {
        return dictConfigMap.get(name)!;
      }
    })
  );
}

export function getDictConfig(name: string): Observable<DictConfig> {
  return getRealDictConfig(name).pipe(
    map((customConfig) =>
      Object.assign({ name }, globalDictConfig, customConfig)
    )
  );
}

export function updateDictConfig(name: string, config: Partial<DictConfig>) {
  return configDB$.pipe(
    take(1),
    switchMap(async (db) => {
      const oldConfig = await db.get('dictionary', name);

      const newConfig = Object.assign(
        { name },
        oldConfig,
        config,
        'chapterSize' in config && config.chapterSize !== oldConfig?.chapterSize
          ? { currentChapter: 0 }
          : {}
      );

      return await db.put('dictionary', newConfig).then((name) => {
        dictConfigMap.get(name)?.next(newConfig);
        return name;
      });
    })
  );
}
