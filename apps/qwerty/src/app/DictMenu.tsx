import { Card, Menu, MenuItem } from '@learner/daisy-solid';
import { map } from 'rxjs';
import { For, Show, from } from 'solid-js';
import { currentDict$$, remoteDicts$ } from '../service/dicts';
import Chapter from './Chapter';

function DictMenu() {
  const dicts = from(
    remoteDicts$.pipe(map(({ dictionaries }) => dictionaries))
  );

  const dict = from(currentDict$$);

  return (
    <div class="bg-base-100 flex h-full gap-4">
      <Menu
        defaultValue={dict()}
        onChange={(dictName?: string) => {
          if (dictName) currentDict$$.next(dictName);
        }}
        class="w-80 gap-4"
      >
        <For each={dicts()}>
          {({ name, description }) => (
            <MenuItem value={name}>
              <Card title={name}>
                <p>{description}</p>
              </Card>
            </MenuItem>
          )}
        </For>
      </Menu>
      <Show when={dict()} keyed>
        {(dictName) => (
          <>
            <div class="w-80 overflow-auto">
              <Chapter dictName={dictName}></Chapter>
            </div>
          </>
        )}
      </Show>
    </div>
  );
}

export default DictMenu;
