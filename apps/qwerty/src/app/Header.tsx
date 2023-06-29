import { useDrawer } from '@learner/daisy-solid';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { themeOrder } from 'daisyui/src/theming/themeDefaults';
import { Show, from } from 'solid-js';
import { currentChapter$ } from '../service/chapters';
import { currentDict$$ } from '../service/dicts';
function Header() {
  const currentDict = from(currentDict$$);

  const currentChapter = from(currentChapter$);

  const [, toggleDrawer] = useDrawer();

  return (
    <header class="navbar justify-between">
      <button
        class="btn-ghost btn text-xl normal-case "
        onClick={[toggleDrawer, true]}
        type="button"
      >
        <div class="breadcrumbs">
          <ul>
            <li>{currentDict()}</li>
            <Show when={currentChapter()} keyed>
              {(currentChapter) => <li>第 {currentChapter + 1} 章</li>}
            </Show>
          </ul>
        </div>
      </button>
      <select
        name="theme"
        aria-label="主题"
        data-choose-theme
        class="select w-full max-w-xs"
      >
        {themeOrder.map((theme: string) => (
          <option value={theme}>{theme}</option>
        ))}
      </select>
    </header>
  );
}

export default Header;
