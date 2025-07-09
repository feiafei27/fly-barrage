import { Ref, ref } from 'vue';
import BarrageRenderer, {
  BarrageImage, FixedBarrageOptions, ScrollBarrageOptions,
  SeniorBarrageOptions, SeniorBarrageConfig,
} from '../../lib/index.ts';
import { blessingRenderFn } from '../customRenders/blessing-render';
import { ElMessage } from 'element-plus';
import { v4 as uuid4 } from 'uuid';
import { getRandomInt } from '../utils';

export default function useSendBarrage(barrageRenderer: Ref<BarrageRenderer | undefined>, video: Ref<HTMLVideoElement>) {
  const barrageText = ref('');
  const barrageImgClick = (img: BarrageImage) => {
    barrageText.value += `[${img.id}]`;
  }
  // 允许发送的字号
  const fontSizes = ref([
    { label: '小', value: 24 },
    { label: '标准', value: 34 },
  ]);
  const currentFontsize = ref(34);
  // 弹幕模式
  const barrageModes = ref<{label: string; value: 'scroll' | 'top' | 'bottom'}[]>([
    { label: '滚动', value: 'scroll' },
    { label: '顶部', value: 'top' },
    { label: '底部', value: 'bottom' },
  ]);
  const currentBarrageMode = ref<'scroll' | 'top' | 'bottom'>('scroll');
  // 弹幕颜色
  const barrageColors = ref([
    '#FE0302', '#FF7204', '#FFAA02',
    '#FFD302', '#FFFF00', '#A0EE00',
    '#00CD00', '#019899', '#4266BE',
    '#89D5FF', '#CC0273', '#222222',
    '#9B9B9B', '#FFFFFF',
  ]);
  const currentBarrageColor = ref('#FE0302');
  const sendBarrage = () => {
    if (!barrageText.value) {
      ElMessage({
        message: '弹幕不能为空',
        type: 'warning',
      });
      return;
    }
    // 构造弹幕对象
    let barrage: FixedBarrageOptions | ScrollBarrageOptions;
    if (currentBarrageMode.value === 'scroll') {
      // 构建滚动弹幕
      barrage = {
        id: uuid4(),
        barrageType: currentBarrageMode.value,
        time: video.value.currentTime * 1000,
        text: barrageText.value,
        fontSize: currentFontsize.value,
        lineHeight: 1.2,
        color: currentBarrageColor.value,
      };
    } else {
      // 构建顶部弹幕和底部弹幕
      barrage = {
        id: uuid4(),
        barrageType: currentBarrageMode.value,
        time: video.value.currentTime * 1000,
        text: barrageText.value,
        fontSize: currentFontsize.value,
        lineHeight: 1.2,
        color: currentBarrageColor.value,
        duration: 6000,
      };
    }
    barrage.prior = true;
    barrageRenderer.value?.send(barrage);
    barrageText.value = '';
  }

  const randomSendBarrage = () => {
    // 构建滚动弹幕
    const barrage: ScrollBarrageOptions = {
      id: uuid4(),
      barrageType: 'scroll',
      time: video.value.currentTime * 1000,
      text: '[0025][0024]测试[0022][0023]',
      fontSize: currentFontsize.value,
      lineHeight: 1.2,
      color: currentBarrageColor.value,
    };
    barrage.prior = true;
    barrageRenderer.value?.send(barrage);
  }

  // 高级弹幕的配置对象
  const seniorBarrageConfig = ref<SeniorBarrageConfig>({
    startLocation: {
      x: 0,
      y: 0,
      type: 'PERCENT',
      offsetX: 0,
      offsetY: 0,
    },
    endLocation: {
      x: 1,
      y: 1,
      type: 'PERCENT',
      offsetX: 0,
      offsetY: 0,
    },
    totalDuration: 10000,
    delay: 2000,
    motionDuration: 6000,
  });

  // 发送高级弹幕
  const sendSeniorBarrage = () => {
    if (!barrageText.value) {
      ElMessage({
        message: '弹幕不能为空',
        type: 'warning',
      });
      return;
    }
    // 构造弹幕对象
    const barrage: SeniorBarrageOptions = {
      id: uuid4(),
      barrageType: 'senior',
      time: video.value.currentTime * 1000,
      text: barrageText.value,
      fontSize: currentFontsize.value,
      lineHeight: 1.2,
      color: currentBarrageColor.value,
      seniorBarrageConfig: seniorBarrageConfig.value,
    }
    try {
      barrage.prior = true;
      barrageRenderer.value?.send(barrage);
      barrageText.value = '';
    } catch (e: any) {
      ElMessage({
        message: e.message,
        type: 'warning',
      });
    }
  }

  // 发送祝福弹幕
  const sendBlessingBarrage = () => {
    const originPath = window.location.origin;

    if (!barrageText.value) {
      ElMessage({
        message: '弹幕不能为空',
        type: 'warning',
      });
      return;
    }

    const lanternWidth = 80;
    const lanternHeight = 80;
    // 0.1 ~ 0.9
    const startLocationX = Math.random() * 0.8 + 0.1;
    // 构造弹幕对象
    const barrage: SeniorBarrageOptions = {
      id: uuid4(),
      barrageType: 'senior',
      time: video.value.currentTime * 1000,
      text: barrageText.value,
      fontSize: currentFontsize.value,
      lineHeight: 1.2,
      color: currentBarrageColor.value,
      addition: {
        grade: getRandomInt(1, 10),
        lanternUrl: originPath + '/icons/custom/001.png',
        lanternWidth,
        lanternHeight,
      },
      customRender: {
        width: 0,
        height: 0,
        renderFn: blessingRenderFn,
      },
      seniorBarrageConfig: {
        startLocation: {
          type: 'PERCENT',
          x: startLocationX,
          y: 1,
        },
        endLocation: {
          type: 'PERCENT',
          x: Math.random() > 0.5 ? startLocationX + 0.1 : startLocationX - 0.1,
          y: 0,
          offsetY: - (lanternHeight + barrageText.value.length * (currentFontsize.value * 1.2)),
        },
        totalDuration: 20000,
        delay: 0,
        motionDuration: 20000,
      },
    }
    try {
      barrage.prior = true;
      barrageRenderer.value?.send(barrage);
      barrageText.value = '';
    } catch (e: any) {
      ElMessage({
        message: e.message,
        type: 'warning',
      });
    }
  }

  return {
    barrageText,
    barrageImgClick,
    fontSizes,
    currentFontsize,
    barrageModes,
    currentBarrageMode,
    barrageColors,
    currentBarrageColor,
    sendBarrage,
    randomSendBarrage,
    seniorBarrageConfig,
    sendSeniorBarrage,
    sendBlessingBarrage,
  }
}
