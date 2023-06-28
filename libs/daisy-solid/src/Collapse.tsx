import { JSX, ParentProps, mergeProps } from 'solid-js';

export type CollapseProps = ParentProps<{
  title?: string | JSX.Element;
  class?: string;
  opened?: boolean;
  onToggle?: (opened: boolean) => void;
}>;

export function Collapse(_props: CollapseProps) {
  const props = mergeProps(
    {
      class: '',
      opened: false,
    },
    _props
  );

  return (
    <div class={'collapse '.concat(props.class)}>
      <input
        type="checkbox"
        aria-label="Collapse controller"
        checked={props.opened}
        onChange={(e) => props.onToggle?.(e.currentTarget.checked)}
      />
      <div class="collapse-title">{props.title}</div>
      <div class="collapse-content">{props.children}</div>
    </div>
  );
}
