import {
  JSX,
  ParentProps,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';

const DrawerContext = createContext(createSignal(false));

export function Drawer(
  props: ParentProps<{
    side?: JSX.Element;
  }>
) {
  const stateSignal = createSignal(false);

  return (
    <DrawerContext.Provider value={stateSignal}>
      <div class="drawer">
        <input
          class="drawer-toggle"
          type="checkbox"
          aria-label="drawer"
          checked={stateSignal[0]()}
        />

        <div class="drawer-content">{props.children}</div>
        <div class="drawer-side">
          <label
            onClick={[stateSignal[1], false]}
            class="drawer-overlay"
          ></label>
          {props.side}
        </div>
      </div>
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
