import { Drawer } from '@learner/daisy-solid';
import { themeChange } from 'theme-change';
import DictMenu from './DictMenu';
import Header from './Header';
import Main from './Main';

function App() {
  themeChange();

  return (
    <Drawer side={<DictMenu />}>
      <section class="container mx-auto grid h-screen grid-flow-row grid-rows-[auto_1fr_auto] gap-20">
        <Header />
        <Main />
      </section>
    </Drawer>
  );
}

export default App;
