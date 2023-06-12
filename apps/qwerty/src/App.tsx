import { Card, Drawer, Menu, MenuItem } from '@learner/daisy-solid';
import { toRx } from '@learner/solid-rx';
import { createSignal } from 'solid-js';
import Header from './Header';
import InputStats from './InputStat';
import Word from './Word';

function App() {
  let wordInputRef: HTMLInputElement | undefined;

  const [input, setInput] = createSignal('');

  toRx(input).subscribe(console.log);

  return (
    <Drawer
      side={
        <Menu initialValue="cet-4">
          <MenuItem value="cet-4">
            <Card title="CET-4">
              <p>英语四级</p>
            </Card>
          </MenuItem>
          <MenuItem value="cet-6">
            <Card title="CET-6">
              <p>英语六级</p>
            </Card>
          </MenuItem>
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
          <Word></Word>
          <InputStats></InputStats>
        </main>
        <footer class="footer footer-center"></footer>
      </section>
    </Drawer>
  );
}

export default App;
