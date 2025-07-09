import { Ref, ref } from 'vue';
import BarrageRenderer from '../../lib/index.ts';

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
