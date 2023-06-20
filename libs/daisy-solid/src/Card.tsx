import { JSX, ParentProps } from 'solid-js';

export function Card(
  props: ParentProps<{
    title?: JSX.Element;
  }>
) {
  return (
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        {props.children}
      </div>
    </div>
  );
}
