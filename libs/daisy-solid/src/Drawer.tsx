import {
  JSX,
  ParentProps,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';

const DrawerContext = createContext(createSignal(false));

export type DrawerProps = ParentProps<{
  side?: JSX.Element;
}>;

export function Drawer(props: DrawerProps) {
  const [opened, setOpened] = createSignal(false);

  return (
    <DrawerContext.Provider value={[opened, setOpened]}>
      <div class="drawer">
        <input
          class="drawer-toggle"
          type="checkbox"
          aria-label="Drawer controller"
          checked={opened()}
        />

        <div class="drawer-content">{props.children}</div>
        <div class="drawer-side">
          <label onClick={[setOpened, false]} class="drawer-overlay"></label>
          {props.side}
        </div>
      </div>
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
