import { Card, Menu, MenuItem } from '@learner/daisy-solid';
import { map } from 'rxjs';
import { For, from } from 'solid-js';
import { currentDict$$, remoteDicts$ } from '../service/dicts';

function DictMenu() {
  const dicts = from(
    remoteDicts$.pipe(map(({ dictionaries }) => dictionaries))
  );

  return (
    <Menu
      initialValue={currentDict$$.value}
      onChange={(dict) => {
        if (dict) {
          currentDict$$.next(dict);
        }
      }}
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
  );
}

export default DictMenu;
