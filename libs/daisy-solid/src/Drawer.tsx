import { JSX, ParentProps, createContext, useContext } from 'solid-js';

export type ToggleFunction = (show?: boolean) => void;

const DrawerContext = createContext<ToggleFunction>(() => null);

export function Drawer(
  props: ParentProps<{
    side?: JSX.Element;
  }>
) {
  let toggleRef: HTMLInputElement | undefined;

  const toggle: ToggleFunction = (show) => {
    if (!toggleRef) throw new Error('toggleRef is undefined');
    toggleRef.checked = show ?? !toggleRef.checked;
  };

  return (
    <DrawerContext.Provider value={toggle}>
      <div class="drawer">
        <input
          class="drawer-toggle"
          type="checkbox"
          aria-label="drawer"
          ref={toggleRef}
        />

        <div class="drawer-content">{props.children}</div>
        <div class="drawer-side">
          <label onClick={[toggle, false]} class="drawer-overlay"></label>
          {props.side}
        </div>
      </div>
    </DrawerContext.Provider>
  );
}

export const useDrawerToggler = () => useContext(DrawerContext);
