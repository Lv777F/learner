import { Stat, Stats } from '@learner/daisy-solid';

function InputStats() {
  return (
    <Stats class="w-full">
      <Stat title="时间" type="time"></Stat>
      <Stat title="输入数"></Stat>
      <Stat title="WPM"></Stat>
      <Stat title="正确数"></Stat>
      <Stat title="正确率"></Stat>
    </Stats>
  );
}

export default InputStats;
