import { ParentProps, VoidProps, mergeProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export type StatsProps = ParentProps<{
  class?: string;
}>;

export function Stats(props: StatsProps) {
  return (
    <ul class={'stats shadow-lg '.concat(props.class ?? '')}>
      {props.children}
    </ul>
  );
}

export type StatProps = VoidProps<{
  value?: number;
  title?: string;
  type?: 'time' | 'count';
}>;

export function Stat(_props: StatProps) {
  const props = mergeProps({ value: 0, type: 'count' }, _props);
  return (
    <li class="stat place-items-center">
      <div class="stat-value font-mono">
        <Dynamic
          component={
            {
              time: () => {
                const min = () => Math.floor(props.value / 60);
                const sec = () => props.value % 60;
                return (
                  <span class="countdown">
                    <span style={{ '--value': min() }} />
                    :
                    <span style={{ '--value': sec() }} />
                  </span>
                );
              },
              count: () => (
                <span class="counter" style={{ '--count': props.value }} />
              ),
            }[props.type]
          }
        ></Dynamic>
      </div>
      <div class="stat-title">{props.title}</div>
    </li>
  );
}
