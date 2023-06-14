import { takeUntilCleanUp } from '@learner/utils';
import { pause$$, start$$ } from '../service/stats';
import { input$$, pass$ } from '../service/words';
import InputStats from './InputStat';
import Word from './Word';

function Main() {
  let wordInputRef: HTMLInputElement | undefined;

  pass$.pipe(takeUntilCleanUp()).subscribe(() => {
    input$$.next('');
  });

  return (
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
