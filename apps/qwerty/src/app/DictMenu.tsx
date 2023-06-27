import {
  Card,
  Menu,
  MenuItem,
  Table,
  Tbody,
  Td,
  Tr,
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
    <div class="bg-base-100 h-full w-80 overflow-auto">
      <Show
        when={dict()}
        keyed
        fallback={
          <Menu initialValue={dict()} onChange={setDict} class="gap-4 p-4">
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
        {(dictValue) => {
          const [] = createSignal();
          return (
            <Table data={Array.from(Array(20), (_, i) => i + 1)}>
              <Tbody>
                {(row) => (
                  <Tr selectable>
                    <Td>{(cell) => cell}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          );
        }}
      </Show>
    </div>
  );
}

export default DictMenu;
