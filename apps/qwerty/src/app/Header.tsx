import { useDrawerToggler } from '@learner/daisy-solid';
import { from } from 'solid-js';
import { themeChange } from 'theme-change';
import { currentDict$$ } from '../service/dicts';
function Header() {
  themeChange();

  const currentDict = from(currentDict$$);

  return (
    <header class="navbar justify-between">
      <button
        class="btn-ghost btn text-xl normal-case"
        onClick={[useDrawerToggler(), true]}
        type="button"
      >
        {currentDict()}
      </button>
      <select
        name="theme"
        aria-label="theme"
        data-choose-theme
        class="select w-full max-w-xs"
      >
        {themes.map((theme) => (
          <option value={theme}>{theme}</option>
        ))}
      </select>
    </header>
  );
}

export default Header;

const themes = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];
