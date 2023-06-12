import { Index, VoidProps, createSignal } from 'solid-js';

function Word(props: VoidProps) {
  const [chars] = createSignal('hello'.split(''));
  return (
    <h2
      class="flex max-w-prose flex-col justify-center text-center font-mono"
      style="text-rendering: optimizeLegibility"
    >
      <dfn class="not-italic">
        <ruby>
          <span class="text-primary text-[5vw]">
            <Index each={chars()}>{(char) => <span>{char()}</span>}</Index>
          </span>
          <rp>(</rp>
          <rt class="text-accent text-[1vw]"></rt>
          <rp>)</rp>
        </ruby>
      </dfn>
      <span class="text-secondary text-[2vw]"></span>
    </h2>
  );
}

export default Word;
