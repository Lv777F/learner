import { useDrawerToggler } from '@learner/daisy-solid';
import { themeChange } from 'theme-change';
function Header() {
  const toggleDrawer = useDrawerToggler();
  themeChange();
  return (
    <header class="navbar justify-between">
      <button
        class="btn-ghost btn text-xl normal-case"
        onClick={[toggleDrawer, true]}
        type="button"
      >
        CET-4
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
export default Header;
