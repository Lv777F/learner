import { Stat, Stats } from '@learner/daisy-solid';
import { map, startWith, switchAll } from 'rxjs';
import { from } from 'solid-js';
import { stats$$ } from '../service/stats';

function InputStats() {
  const stats = from(
    stats$$.pipe(
      map(
        startWith({
          second: 0,
          totalInputCount: 0,
          wpm: 0,
          correctInputCount: 0,
          correctRate: 0,
        })
      ),
      switchAll()
    )
  );

  return (
    <Stats class="w-full">
      <Stat title="时间" type="time" value={stats()?.second}></Stat>
      <Stat title="输入数" value={stats()?.totalInputCount}></Stat>
      <Stat title="WPM" value={stats()?.wpm}></Stat>
      <Stat title="正确数" value={stats()?.correctInputCount}></Stat>
      <Stat
        title="正确率"
        value={Math.floor((stats()?.correctRate ?? 0) * 100)}
      ></Stat>
    </Stats>
  );
}

export default InputStats;
