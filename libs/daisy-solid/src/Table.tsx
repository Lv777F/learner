import {
  Accessor,
  FlowProps,
  For,
  JSX,
  ParentProps,
  Ref,
  Setter,
  Signal,
  children,
  createContext,
  createEffect,
  createSelector,
  createSignal,
  mergeProps,
  on,
  useContext,
} from 'solid-js';

export type TableProps<T> = ParentProps<{
  data?: Accessor<T[] | undefined>;
  ['pin-rows']?: boolean;
  ['pin-cols']?: boolean;
  zebra?: boolean;
  onSelect?: (selected: T) => void;
  selected?: Accessor<T>;
}>;

const TableContext = createContext<
  [
    Accessor<unknown[] | undefined>,
    Signal<unknown>,
    (current?: unknown) => boolean
  ]
>([() => [], createSignal(), () => false]);

export function Table<T = unknown>(_props: TableProps<T>) {
  const [selected, setSelected] = createSignal<T | undefined>();

  const props = mergeProps(
    {
      class: '',
      ['pin-rows']: false,
      ['pin-cols']: false,
      zebra: false,
      data: (() => []) as Accessor<T[]>,
      selected,
    },
    _props
  );

  createEffect(
    on(
      selected,
      (selected) => {
        if (selected) props.onSelect?.(selected);
      },
      { defer: true }
    )
  );

  const isActive = createSelector<unknown>(props.selected);

  return (
    <table
      class={'table '.concat(props.class)}
      classList={{
        'table-pin-rows': props['pin-rows'],
        'table-zebra': props.zebra,
        'table-pin-cols': props['pin-cols'],
      }}
    >
      <TableContext.Provider
        value={[
          props.data,
          [props.selected, setSelected as Setter<unknown>],
          isActive,
        ]}
      >
        {props.children}
      </TableContext.Provider>
    </table>
  );
}

export function Thead(
  props: ParentProps<{
    class?: string;
  }>
) {
  return <thead {...props}>{props.children}</thead>;
}

const RowContext = createContext();

export function Tbody<T>(
  props: FlowProps<
    { data?: Accessor<T[] | undefined>; class?: string },
    (row: T, i: Accessor<number>) => JSX.Element
  >
) {
  const data = props.data ?? useContext(TableContext)[0];

  return (
    <tbody class={props.class}>
      <For each={data()}>
        {(row, i) => (
          <RowContext.Provider value={row}>
            {props.children(row as T, i)}
          </RowContext.Provider>
        )}
      </For>
    </tbody>
  );
}

export function Row(
  _props: ParentProps<{
    class?: string;
    selectable?: boolean;
    ref?: Ref<HTMLTableRowElement>;
    onSelected?: (ref: HTMLTableRowElement) => void;
  }>
) {
  const props = mergeProps(
    {
      class: '',
      selectable: false,
    },
    _props
  );

  const row = useContext(RowContext);

  const [, [, setSelected], isActive] = useContext(TableContext);

  createEffect(() => {
    if (isActive(row)) props.onSelected?.(props.ref as HTMLTableRowElement);
  });

  return (
    <tr
      class={''.concat(props.class)}
      ref={props.ref}
      classList={{
        'hover cursor-pointer': props.selectable,
        'bg-base-200': isActive(row),
      }}
      onClick={() => {
        if (props.selectable) setSelected(row);
      }}
    >
      {props.children}
    </tr>
  );
}

const CellContext = createContext();

export function Cell<T, U extends keyof T>(
  props: FlowProps<
    { key?: U; head?: boolean },
    (cell: T[U] | undefined) => JSX.Element
  >
) {
  const row = useContext(RowContext) as T;
  const cell = props.key ? row[props.key] : undefined;
  const cellContent = children(() => props.children(cell));
  return (
    <CellContext.Provider value={cell}>
      {props.head ? <th>{cellContent()}</th> : <td>{cellContent()}</td>}
    </CellContext.Provider>
  );
}
