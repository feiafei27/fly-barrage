import { Ref, ref } from 'vue';
import BarrageRenderer from '../../lib/index.ts';

export default function useSpeed(barrageRenderer: Ref<BarrageRenderer | undefined>) {
  const speeds = ref([
    {label: '100', value: 100},
    {label: '150', value: 150},
    {label: '200', value: 200},
    {label: '250', value: 250},
    {label: '300', value: 300},
  ])
  // 当前的速度
  const currentSpeed = ref(100);
  const speedChange = () => {
    barrageRenderer.value?.setRenderConfig({
      speed: currentSpeed.value
    })
  }

  return {
    speeds,
    currentSpeed,
    speedChange,
  }
}
