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
  repeatCount: number;
  chapterSize: number;
  shuffle: boolean;
  currentChapter?: number;
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

const globalDictConfig: DictConfig = {
  chapterSize: 20,
  repeatCount: 1,
  shuffle: false,
  currentChapter: 1,
};

const dictConfigMap = new Map<string, ReplaySubject<Partial<DictConfig>>>();

function getRealDictConfig(dictName: string) {
  return configDB$.pipe(
    take(1),
    switchMap((db) => {
      if (!dictConfigMap.has(dictName)) {
        const rsubj = new ReplaySubject<Partial<DictConfig>>();
        dictConfigMap.set(dictName, rsubj);
        db.get('dictionary', dictName).then((config) => {
          rsubj.next(config ?? {});
        });
        return rsubj;
      } else {
        return dictConfigMap.get(dictName)!;
      }
    })
  );
}

export function getDictConfig(dictName: string): Observable<DictConfig> {
  return getRealDictConfig(dictName).pipe(
    map((customConfig) => Object.assign({}, globalDictConfig, customConfig))
  );
}

export function updateDictConfig(
  dictName: string,
  config: Partial<DictConfig>
) {
  return configDB$.pipe(
    take(1),
    switchMap(async (db) => {
      const oldConfig = await db.get('dictionary', dictName);
      console.log(oldConfig);
      const newConfig = Object.assign(
        {},
        oldConfig,
        config,
        'chapterSize' in config && config.chapterSize !== oldConfig?.chapterSize
          ? { currentChapter: 1 }
          : {}
      );

      await db.put('dictionary', newConfig, dictName);
      dictConfigMap.get(dictName)?.next(newConfig);
    })
  );
}
