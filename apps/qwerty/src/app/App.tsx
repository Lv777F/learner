import { Drawer } from '@learner/daisy-solid';
import DictMenu from './DictMenu';
import Header from './Header';
import Main from './Main';

function App() {
  return (
    <Drawer side={<DictMenu />}>
      <section class="container mx-auto grid h-screen grid-flow-row grid-rows-[auto_1fr_auto] gap-20">
        <Header />
        <Main />
        <footer class="footer footer-center" />
      </section>
    </Drawer>
  );
}

export default App;
