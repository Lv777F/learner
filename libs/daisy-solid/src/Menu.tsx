import {
  ParentProps,
  Signal,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js';

export const MenuContext = createContext(createSignal());

export function Menu<T>(
  props: ParentProps<{
    initialValue?: T;
    onChange?: (value?: T) => void;
  }>
) {
  const valueSignal = createSignal(props.initialValue);

  createEffect(() => {
    props.onChange?.(valueSignal[0]());
  });

  return (
    <MenuContext.Provider value={valueSignal as Signal<unknown>}>
      <ul class="menu bg-base-100 h-full w-80 gap-y-4 p-4">{props.children}</ul>
    </MenuContext.Provider>
  );
}

export function MenuItem<T>(
  props: ParentProps<{
    value: T;
  }>
) {
  const [value, setValue] = useContext(MenuContext);

  return (
    <li>
      <a
        classList={{
          active: value() === props.value,
        }}
        onClick={[setValue, props.value]}
      >
        {props.children}
      </a>
    </li>
  );
}
