import {
  ParentProps,
  Signal,
  createContext,
  createEffect,
  createSelector,
  createSignal,
  mergeProps,
  useContext,
} from 'solid-js';

export const MenuContext = createContext(createSignal());

export type MenuProps<T> = ParentProps<{
  initialValue?: T;
  onChange?: (value?: T) => void;
  class?: string;
}>;

export function Menu<T>(_props: MenuProps<T>) {
  const props = mergeProps({ class: '' }, _props);

  const valueSignal = createSignal(props.initialValue);

  createEffect(() => {
    props.onChange?.(valueSignal[0]());
  });

  return (
    <MenuContext.Provider value={valueSignal as Signal<unknown>}>
      <ul class={'menu '.concat(props.class)}>{props.children}</ul>
    </MenuContext.Provider>
  );
}

export type MenuItemProps<T> = ParentProps<{
  value: T;
}>;

export function MenuItem<T>(props: MenuItemProps<T>) {
  const [value, setValue] = useContext(MenuContext);
  const isActive = createSelector(value);

  return (
    <li>
      <div
        classList={{
          active: isActive(props.value),
        }}
        onClick={[setValue, props.value]}
      >
        {props.children}
      </div>
    </li>
  );
}
