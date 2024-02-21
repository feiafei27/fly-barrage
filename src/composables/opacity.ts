import { Ref, ref } from 'vue';
import BarrageRenderer from '../../lib';

export default function useOpacity(barrageRenderer: Ref<BarrageRenderer | undefined>) {
  const opacity = ref(100);
  const opacityChange = () => {
    barrageRenderer.value?.setRenderConfig({
      opacity: opacity.value / 100
    });
  };

  return {
    opacity,
    opacityChange,
  }
}
