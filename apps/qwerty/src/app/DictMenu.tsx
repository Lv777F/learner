import {
  Card,
  Collapse,
  Menu,
  MenuItem,
  useDrawer,
} from '@learner/daisy-solid';
import { map } from 'rxjs';
import { For, Show, createEffect, createSignal, from } from 'solid-js';
import { currentDict$$, remoteDicts$ } from '../service/dicts';

function DictMenu() {
  const dicts = from(
    remoteDicts$.pipe(map(({ dictionaries }) => dictionaries))
  );

  const [drawerState] = useDrawer();

  const [dict, setDict] = createSignal<string | null>(currentDict$$.value);

  createEffect(() => {
    if (drawerState()) {
      setDict(currentDict$$.value);
    }
  });

  return (
    <div class="bg-base-100 h-full w-80 p-4">
      <Show
        when={dict()}
        keyed
        fallback={
          <Menu initialValue={dict()} onChange={setDict} class="gap-4">
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
        }
      >
        {(dictValue) => (
          <Collapse title="章节" opened class="bg-base-200"></Collapse>
        )}
      </Show>
    </div>
  );
}

export default DictMenu;
