import {
  Accessor,
  FlowProps,
  For,
  JSX,
  ParentProps,
  Signal,
  createContext,
  createEffect,
  createSelector,
  createSignal,
  mergeProps,
  useContext,
} from 'solid-js';

export type TableProps<T> = ParentProps<{
  data?: T[];
  ['pin-rows']?: boolean;
  zebra?: boolean;
  onSelect?: (row: T | null) => void;
}>;

const TableContext = createContext<{
  data: unknown[];
  selected: Signal<any>;
}>({
  data: [],
  selected: createSignal(),
});

export function Table<T>(_props: TableProps<T>) {
  const props = mergeProps(
    { class: '', ['pin-rows']: false, zebra: false, data: [] as T[] },
    _props
  );

  const selected = createSignal<T | null>(null);

  createEffect(() => {
    props.onSelect?.(selected[0]());
  });

  return (
    <table
      class={'table '.concat(props.class)}
      classList={{
        'table-pin-rows': props['pin-rows'],
        'table-zebra': props.zebra,
      }}
    >
      <TableContext.Provider
        value={{ data: props.data, selected: selected as Signal<any> }}
      >
        {props.children}
      </TableContext.Provider>
    </table>
  );
}

export function Thead(props: ParentProps) {
  return <thead>{props.children}</thead>;
}

const RowContext = createContext();

export function Tbody<T>(
  props: FlowProps<{
    children: (row: T, i: Accessor<number>) => JSX.Element;
  }>
) {
  const { data } = useContext(TableContext);

  return (
    <tbody>
      <For each={data as T[]}>
        {(row, i) => (
          <RowContext.Provider value={row}>
            {props.children(row, i)}
          </RowContext.Provider>
        )}
      </For>
    </tbody>
  );
}

export function Tr(
  _props: ParentProps<{
    class?: string;
    selectable?: boolean;
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
  const {
    selected: [selected, setSelected],
  } = useContext(TableContext);

  const isActive = createSelector(selected);

  return (
    <tr
      class={''.concat(props.class)}
      classList={{
        'hover cursor-pointer': props.selectable,
        'bg-base-300': isActive(row),
      }}
      onClick={() => props.selectable && setSelected(row)}
    >
      {props.children}
    </tr>
  );
}

const CellContext = createContext();

export function Td<T, U extends keyof T>(
  props: ParentProps<{ key?: U; children?: (cell: T[U] | T) => JSX.Element }>
) {
  const row = useContext(RowContext) as T;
  const cell = props.key ? row[props.key] : row;
  return (
    <CellContext.Provider value={cell}>
      <td>{props.children?.(cell)}</td>
    </CellContext.Provider>
  );
}
