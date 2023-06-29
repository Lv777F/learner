import { createEffect, from } from 'solid-js';
import { pause$$, start$$ } from '../service/stats';
import { input$$ } from '../service/words';
import InputStats from './InputStat';
import Word from './Word';

function Main() {
  let wordInputRef: HTMLInputElement | undefined;

  const input = from(input$$);

  createEffect(() => {
    const inputValue = input() ?? '';
    if (wordInputRef && wordInputRef.value !== inputValue) {
      wordInputRef.value = inputValue;
    }
  });

  return (
    <main
      class="grid-flow-rows grid grid-rows-[1fr_auto] justify-items-center gap-20 outline-none"
      tabindex="0"
      onFocus={() => wordInputRef?.focus()}
    >
      <input
        class="fixed h-0 w-0 opacity-0"
        type="text"
        ref={wordInputRef}
        aria-label="单词输入"
        onBlur={() => pause$$.next()}
        onFocus={() => start$$.next()}
        onInput={(e) => input$$.next(e.currentTarget.value)}
      />
      <Word></Word>
      <InputStats></InputStats>
    </main>
  );
}

export default Main;
