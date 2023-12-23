import {
  ParentProps,
  Setter,
  createContext,
  createEffect,
  createSelector,
  createSignal,
  mergeProps,
  on,
  useContext,
} from 'solid-js';

export const MenuContext = createContext([
  createSignal(),
  (value: unknown) => false as boolean,
] as const);

export type MenuProps<T> = ParentProps<{
  defaultValue?: T;
  onChange?: (value: T | undefined) => void;
  class?: string;
}>;

export function Menu<T = unknown>(_props: MenuProps<T>) {
  const props = mergeProps({ class: '' }, _props);

  const [value, setValue] = createSignal<T | undefined>(props.defaultValue);

  const isActive = createSelector<unknown>(value);

  createEffect(
    on(
      value,
      () => {
        props.onChange?.(value());
      },
      { defer: true },
    ),
  );

  return (
    <MenuContext.Provider
      value={[[value, setValue as Setter<unknown>], isActive]}
    >
      <ul class={'menu '.concat(props.class)}>{props.children}</ul>
    </MenuContext.Provider>
  );
}

export type MenuItemProps<T> = ParentProps<{
  value: T;
  disabled?: boolean;
}>;

export function MenuItem<T = unknown>(props: MenuItemProps<T>) {
  const [[, setValue], isActive] = useContext(MenuContext);

  return (
    <li>
      <a
        classList={{
          active: isActive(props.value),
        }}
        onClick={() => {
          if (!props.disabled) setValue(props.value as unknown);
        }}
      >
        {props.children}
      </a>
    </li>
  );
}
