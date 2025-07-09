import { Ref, ref } from 'vue';
import BarrageRenderer from '../../lib/index.ts';

export default function useBarrageOpen(barrageRenderer: Ref<BarrageRenderer | undefined>) {
  const barrageOpen = ref(true);

  const barrageOpenChange = (isOpen: boolean) => {
    barrageRenderer.value?.switch(isOpen);
  };

  return {
    barrageOpen,
    barrageOpenChange,
  }
}
