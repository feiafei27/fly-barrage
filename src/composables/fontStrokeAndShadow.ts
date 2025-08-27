import { Ref, ref, computed, watch } from 'vue';
import BarrageRenderer, {
  FontStrokeAndShadow,
  DEFAULT_FONT_STROKE,
  DEFAULT_FONT_SHADOW,
} from '../../lib/index.ts';

type FontStrokeAndShadowConfig = {
  id: number,
  name: string;
  config: Partial<FontStrokeAndShadow>;
};

// 定义字体描边相关
export default function useFontStrokeAndShadow(barrageRenderer: Ref<BarrageRenderer | undefined>) {
  // 配置可选择的字体描边
  const fontStrokeAndShadowConfigs = ref<Array<FontStrokeAndShadowConfig>>([
    {
      id: 1,
      name: '无',
      config: {}
    },
    {
      id: 2,
      name: '绿色描边',
      config: {
        strokeStyle: 'green',
        lineWidth: 2,
        lineJoin: 'round',
      }
    },
    {
      id: 3,
      name: '紫色投影',
      config: {
        shadowColor: '#B303F2',
        // 这个阴影属性蛮影响性能的，如果可能的话，可以设置为 0
        // 持续优化性能中
        shadowBlur: 0,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      }
    }
  ])
  // 当前选择的配置 id
  const currentStrokeShadowId = ref<number>(2);
  // 当前选择的配置
  const currentStrokeShadowConfig = computed<Partial<FontStrokeAndShadow>>(() => {
    const config = fontStrokeAndShadowConfigs.value.find(item => item.id === currentStrokeShadowId.value)?.config || {};
    return {
      ...DEFAULT_FONT_STROKE,
      ...DEFAULT_FONT_SHADOW,
      ...config,
    }
  });
  watch(currentStrokeShadowId, () => {
    barrageRenderer.value?.setRenderConfig({
      ...currentStrokeShadowConfig.value,
    })
  });

  return {
    fontStrokeAndShadowConfigs,
    currentStrokeShadowId,
    currentStrokeShadowConfig,
  }
}
