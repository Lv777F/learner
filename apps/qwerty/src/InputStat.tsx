import { Stat, Stats } from '@learner/daisy-solid';

function InputStats() {
  return (
    <Stats class="w-full">
      <Stat title="时间" type="time"></Stat>
      <Stat title="输入数" type="count"></Stat>
      <Stat title="WPM" type="count"></Stat>
      <Stat title="正确数" type="count"></Stat>
      <Stat title="正确率" type="count"></Stat>
    </Stats>
  );
}

export default InputStats;
