import { ref, onMounted, Ref } from 'vue';
import ResizeObserver from 'resize-observer-polyfill';
import _ from 'lodash';
import BarrageRenderer from '../../lib/index.ts';

export default function useResize(barrageRenderer: Ref<BarrageRenderer | undefined>) {
  // canvas 尺寸随 container 尺寸自适应
  const isFirstResizeObserver = ref(true);
  onMounted(() => {
    new ResizeObserver(_.debounce(() => {
      if (isFirstResizeObserver.value) {
        isFirstResizeObserver.value = false;
        return;
      }
      barrageRenderer.value?.resize();
    }, 150)).observe(document.getElementById('container')!);
  });
}
