import { Ref, ref } from 'vue';
import BarrageRenderer from '../../lib';

export default function useRenderRegion(barrageRenderer: Ref<BarrageRenderer | undefined>) {
  const renderRegions = ref([
    {label: '1/4', value: 0.25},
    {label: '半屏', value: 0.5},
    {label: '3/4', value: 0.75},
    {label: '全屏', value: 1}
  ]);
  // 当前选择的显示区域
  const currentRenderRegions = ref(1);
  const renderRegionsChange = () => {
    barrageRenderer.value?.setRenderConfig({
      renderRegion: currentRenderRegions.value
    });
  };

  return {
    renderRegions,
    currentRenderRegions,
    renderRegionsChange,
  }
}
