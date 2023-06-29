import { useDrawer } from '@learner/daisy-solid';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { themeOrder } from 'daisyui/src/theming/themeDefaults';
import { from } from 'solid-js';
import { currentDict$$ } from '../service/dicts';
function Header() {
  const currentDict = from(currentDict$$);

  const [, toggleDrawer] = useDrawer();

  return (
    <header class="navbar justify-between">
      <button
        class="btn-ghost btn text-xl normal-case"
        onClick={[toggleDrawer, true]}
        type="button"
      >
        {currentDict()}
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
