import { Accessor, Index, VoidProps, createMemo } from 'solid-js';
import { Word as WordType } from './dicts';

function Word(
  props: VoidProps<{
    word: Accessor<WordType | undefined>;
    input: Accessor<string>;
  }>
) {
  const chars = createMemo(() => props.word()?.word.split(''));
  const meaning = createMemo(() => props.word()?.meanings.join(', '));

  return (
    <h2
      class="flex max-w-prose flex-col justify-center text-center font-mono"
      style="text-rendering: optimizeLegibility"
    >
      <dfn class="not-italic">
        <ruby>
          <span class="text-primary text-[5vw]">
            <Index each={chars()}>
              {(char, i) => {
                const inputChar = createMemo(() => props.input()[i]);
                const isCorrect = () => char() === inputChar();
                return (
                  <span
                    class={
                      inputChar()
                        ? isCorrect()
                          ? 'text-success'
                          : 'text-error'
                        : ''
                    }
                  >
                    {char()}
                  </span>
                );
              }}
            </Index>
          </span>
          <rp>(</rp>
          <rt class="text-accent text-[1vw]">{props.word()?.pronunciation}</rt>
          <rp>)</rp>
        </ruby>
      </dfn>
      <span class="text-secondary text-[2vw]">{meaning()}</span>
    </h2>
  );
}

export default Word;
