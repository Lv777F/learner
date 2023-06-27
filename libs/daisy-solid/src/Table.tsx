import {
  For,
  JSX,
  ParentProps,
  Show,
  Signal,
  createContext,
  createEffect,
  createSelector,
  createSignal,
  mergeProps,
  splitProps,
  useContext,
} from 'solid-js';

export type TableProps<T> = ParentProps<
  {
    class?: string;
    pinned?: boolean;
    zebra?: boolean;
    grouped?: boolean;
  } & Partial<ColumnGroupProps<T>>
>;

export function Table<T>(_props: TableProps<T>) {
  const [props, columnGroupProps] = splitProps(
    mergeProps(
      {
        class: '',
        pinned: false,
        zebra: false,
        grouped: false,
        data: [] as T[],
      },
      _props
    ),
    ['pinned', 'zebra', 'grouped', 'class', 'children']
  );

  return (
    <table
      class={'table '.concat(props.class)}
      classList={{
        'table-pin-rows': props.pinned,
        'table-zebra': props.zebra,
        '[&>tbody>tr]:cursor-pointer': columnGroupProps.selectable,
      }}
    >
      <Show
        when={props.grouped}
        fallback={
          <ColumnGroup {...columnGroupProps}>{props.children}</ColumnGroup>
        }
      >
        {props.children}
      </Show>
    </table>
  );
}

const RowContext = createContext<any>();

export type RowProps = ParentProps<{
  class?: string;
  // TODO
  sortable?: boolean;
}>;

export function Row(props: RowProps) {
  return <th class={props.class}>{props.children}</th>;
}

export const useRow: <T>() => T = () => useContext(RowContext)();

export type ColumnGroupProps<T> = ParentProps<{
  data?: T[];
  rows?: JSX.Element;
  selectable?: boolean;
  onSelect?: (row: T | null) => void;
  initialSelected?: T;
}>;

const GroupContext = createContext<any>();

export function ColumnGroup<T>(props: ColumnGroupProps<T>) {
  const selected = createSignal<T | null>(props.initialSelected ?? null);

  createEffect(() => {
    props.onSelect?.(selected[0]());
  });

  return (
    <GroupContext.Provider value={selected}>
      <thead>
        <tr>{props.rows}</tr>
      </thead>
      <tbody>
        <For each={props.data}>
          {(row) => (
            <RowContext.Provider value={row}>
              <tr>{props.children}</tr>
            </RowContext.Provider>
          )}
        </For>
      </tbody>
    </GroupContext.Provider>
  );
}

export const useGroup: <T>() => Signal<T> = () => useContext(GroupContext)();

export type ColumnProps = ParentProps<{
  key?: string;
  class?: string;
}>;

const CellContext = createContext<any>();

export function Column(props: ColumnProps) {
  const [selectedColumn, setSelectedColumn] = useGroup();
  const isSelected = createSelector(selectedColumn);

  const row = useRow<any>();
  const cell = props.key ? row?.[props.key] : row;

  return (
    <CellContext.Provider value={cell}>
      <td class={props.class} classList={{ 'bg-base-200': isSelected(cell) }}>
        {props.children ?? cell}
      </td>
    </CellContext.Provider>
  );
}

export const useCell: <T>() => T = () => useContext(CellContext)();
