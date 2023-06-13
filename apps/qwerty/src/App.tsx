import { stepByStep, stepControl } from '@learner/core';
import { Card, Drawer, Menu, MenuItem } from '@learner/daisy-solid';
import {
  Subject,
  bufferCount,
  delayWhen,
  filter,
  map,
  merge,
  from as rxFrom,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { For, createSignal, from, observable } from 'solid-js';
import Header from './Header';
import InputStats from './InputStat';
import Word from './Word';
import {
  Word as WordType,
  getPaginatedItems,
  remoteDictionaries$,
  syncLocalDictionary,
} from './dicts';

function App() {
  let wordInputRef: HTMLInputElement | undefined;

  const [input, setInput] = createSignal('');
  const input$ = rxFrom(observable(input));

  const resetInput = () => {
    if (wordInputRef) {
      wordInputRef.value = '';
    }
    setInput('');
  };

  const [dict, setDict] = createSignal('CET-4');
  const dicts = from(
    remoteDictionaries$.pipe(map(({ dictionaries }) => dictionaries))
  );

  const words$ = rxFrom(observable(dict)).pipe(
    delayWhen(syncLocalDictionary),
    switchMap((dictName) => getPaginatedItems<WordType>(dictName, 0, 2))
  );

  const jump$ = new Subject<number>();
  const skip$ = new Subject<void>();

  const word = from(
    words$.pipe(
      stepControl(
        jump$,
        stepByStep(({ word }) =>
          merge(
            input$.pipe(
              filter((input) => word === input),
              tap(() => timer(200).subscribe(resetInput)),
              bufferCount(3)
            ),
            skip$
          )
        )
      ),
      switchMap((word) => word)
    )
  );

  return (
    <Drawer
      side={
        <Menu initialValue={dict()} onChange={setDict}>
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
      <section class="container mx-auto grid h-screen grid-flow-row grid-rows-[auto_1fr_auto] gap-20">
        <Header></Header>
        <main
          class="grid-flow-rows grid grid-rows-[1fr_auto] justify-items-center gap-20 outline-none"
          tabindex="0"
          onFocus={() => wordInputRef?.focus()}
        >
          <input
            type="text"
            ref={wordInputRef}
            class="fixed h-0 w-0 opacity-0"
            aria-label="word input"
            onInput={(e) => setInput(e.currentTarget.value)}
          />
          <Word word={word} input={input}></Word>
          <InputStats></InputStats>
        </main>
        <footer class="footer footer-center"></footer>
      </section>
    </Drawer>
  );
}

export default App;
