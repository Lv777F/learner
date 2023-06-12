import { Observable } from 'rxjs';
import { ParentProps, VoidProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function Stats(props: ParentProps<{ class?: string }>) {
  return (
    <ul class={'stats shadow-lg '.concat(props.class ?? '')}>
      {props.children}
    </ul>
  );
}

export function Stat(
  props: VoidProps<{
    value$?: Observable<number>;
    title?: string;
    type: 'time' | 'count';
  }>
) {
  return (
    <li class="stat place-items-center">
      <div class="stat-value font-mono">
        <Dynamic
          component={
            {
              time: () => (
                <span class="countdown">
                  <span style={{ '--value': '0' }} />:
                  <span style={{ '--value': '0' }} />
                </span>
              ),
              count: () => <span class="counter" style={{ '--count': '0' }} />,
            }[props.type]
          }
        ></Dynamic>
      </div>
      <div class="stat-title">{props.title}</div>
    </li>
  );
}
