import { JSX, ParentProps } from 'solid-js';

export type CardProps = ParentProps<{
  title?: JSX.Element;
}>;

export function Card(props: CardProps) {
  return (
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">{props.title}</h2>
        {props.children}
      </div>
    </div>
  );
}
