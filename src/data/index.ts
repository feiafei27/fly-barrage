import { BarrageImage, BarrageOptions } from '../../lib';
import { blessingRenderFn } from '../customRenders/blessing-render';

import { v4 as uuid4 } from 'uuid';
import { getRandomInt } from '../utils';

export type generateBarrageConfig = {
  isFixed: boolean;
  isScroll: boolean;
  isSenior: boolean;
  isSpecial: boolean;

  fixedNum: number;
  scrollNum: number;
  seniorNum: number;
  specialNum: number;
}

export type ImageGroups = {
  id: number,
  label: string,
  icon: BarrageImage,
  images: BarrageImage[]
};

const originPath = window.location.origin;

// 图片配置数据
const barrageImagesGroup1: BarrageImage[] = [
  { id: '0001', url: originPath + '/icons/common/0001.png', width: 75, height: 30 },
  { id: '0002', url: originPath + '/icons/common/0002.png', width: 69, height: 30 },
  { id: '0003', url: originPath + '/icons/common/0003.png', width: 93, height: 30 },
  { id: '0004', url: originPath + '/icons/common/0004.png', width: 80, height: 30 },
  { id: '0005', url: originPath + '/icons/common/0005.png', width: 100, height: 30 },
  { id: '0006', url: originPath + '/icons/common/0006.png', width: 72, height: 30 },
  { id: '0007', url: originPath + '/icons/common/0007.png', width: 78, height: 30 },
  { id: '0008', url: originPath + '/icons/common/0008.png', width: 76, height: 30 },
  { id: '0009', url: originPath + '/icons/common/0009.png', width: 81, height: 30 },
  { id: '0010', url: originPath + '/icons/common/0010.png', width: 92, height: 30 },
  { id: '0011', url: originPath + '/icons/common/0011.png', width: 98, height: 30 },
  { id: '0012', url: originPath + '/icons/common/0012.png', width: 104, height: 30 },
  { id: '0013', url: originPath + '/icons/common/0013.png', width: 81, height: 30 },
  { id: '0014', url: originPath + '/icons/common/0014.png', width: 84, height: 30 },
  { id: '0015', url: originPath + '/icons/common/0015.png', width: 99, height: 30 },
  { id: '0016', url: originPath + '/icons/common/0016.png', width: 80, height: 30 },
  { id: '0017', url: originPath + '/icons/common/0017.png', width: 87, height: 30 },
  { id: '0018', url: originPath + '/icons/common/0018.png', width: 102, height: 30 },
  { id: '0019', url: originPath + '/icons/common/0019.png', width: 78, height: 30 },
  { id: '0020', url: originPath + '/icons/common/0020.png', width: 81, height: 30 },
  { id: '0021', url: originPath + '/icons/common/0021.png', width: 66, height: 30 },
  { id: '0022', url: originPath + '/icons/common/0022.png', width: 98, height: 30 },
  { id: '0023', url: originPath + '/icons/common/0023.png', width: 72, height: 30 },
  { id: '0024', url: originPath + '/icons/common/0024.png', width: 90, height: 30 },
];

const barrageImagesGroup2: BarrageImage[] = [
  { id: '0025', url: originPath + '/icons/head/0001.png', width: 40, height: 40 },
  { id: '0026', url: originPath + '/icons/head/0002.png', width: 40, height: 40 },
  { id: '0027', url: originPath + '/icons/head/0003.png', width: 40, height: 40 },
  { id: '0028', url: originPath + '/icons/head/0004.png', width: 40, height: 40 },
  { id: '0029', url: originPath + '/icons/head/0005.png', width: 40, height: 40 },
  { id: '0030', url: originPath + '/icons/head/0006.png', width: 40, height: 40 },
  { id: '0031', url: originPath + '/icons/head/0007.png', width: 40, height: 40 },
  { id: '0032', url: originPath + '/icons/head/0008.png', width: 40, height: 40 },
  { id: '0033', url: originPath + '/icons/head/0009.png', width: 40, height: 40 },
  { id: '0034', url: originPath + '/icons/head/0010.png', width: 40, height: 40 },
  { id: '0035', url: originPath + '/icons/head/0011.png', width: 40, height: 40 },
  { id: '0036', url: originPath + '/icons/head/0012.png', width: 40, height: 40 },
  { id: '0037', url: originPath + '/icons/head/0013.png', width: 40, height: 40 },
  { id: '0038', url: originPath + '/icons/head/0014.png', width: 40, height: 40 },
  { id: '0039', url: originPath + '/icons/head/0015.png', width: 40, height: 40 },
  { id: '0040', url: originPath + '/icons/head/0016.png', width: 40, height: 40 },
  { id: '0041', url: originPath + '/icons/head/0017.png', width: 40, height: 40 },
  { id: '0042', url: originPath + '/icons/head/0018.png', width: 40, height: 40 },
  { id: '0043', url: originPath + '/icons/head/0019.png', width: 40, height: 40 },
  { id: '0044', url: originPath + '/icons/head/0020.png', width: 40, height: 40 },
  { id: '0045', url: originPath + '/icons/head/0021.png', width: 40, height: 40 },
  { id: '0046', url: originPath + '/icons/head/0022.png', width: 40, height: 40 },
  { id: '0047', url: originPath + '/icons/head/0023.png', width: 40, height: 40 },
  { id: '0048', url: originPath + '/icons/head/0024.png', width: 40, height: 40 },
  { id: '0049', url: originPath + '/icons/head/0025.png', width: 40, height: 40 },
  { id: '0050', url: originPath + '/icons/head/0026.png', width: 40, height: 40 },
  { id: '0051', url: originPath + '/icons/head/0027.png', width: 40, height: 40 },
  { id: '0052', url: originPath + '/icons/head/0028.png', width: 40, height: 40 },
  { id: '0053', url: originPath + '/icons/head/0029.png', width: 40, height: 40 },
  { id: '0054', url: originPath + '/icons/head/0030.png', width: 40, height: 40 },
  { id: '0055', url: originPath + '/icons/head/0031.png', width: 40, height: 40 },
  { id: '0056', url: originPath + '/icons/head/0032.png', width: 40, height: 40 },
  { id: '0057', url: originPath + '/icons/head/0033.png', width: 40, height: 40 },
  { id: '0058', url: originPath + '/icons/head/0034.png', width: 40, height: 40 },
  { id: '0059', url: originPath + '/icons/head/0035.png', width: 40, height: 40 },
  { id: '0060', url: originPath + '/icons/head/0036.png', width: 40, height: 40 },
  { id: '0061', url: originPath + '/icons/head/0037.png', width: 40, height: 40 },
  { id: '0062', url: originPath + '/icons/head/0038.png', width: 40, height: 40 },
  { id: '0063', url: originPath + '/icons/head/0039.png', width: 40, height: 40 },
  { id: '0064', url: originPath + '/icons/head/0040.png', width: 40, height: 40 },
  { id: '0065', url: originPath + '/icons/head/0041.png', width: 40, height: 40 },
  { id: '0066', url: originPath + '/icons/head/0042.png', width: 40, height: 40 },
  { id: '0067', url: originPath + '/icons/head/0043.png', width: 40, height: 40 },
  { id: '0068', url: originPath + '/icons/head/0044.png', width: 40, height: 40 },
  { id: '0069', url: originPath + '/icons/head/0045.png', width: 40, height: 40 },
  { id: '0070', url: originPath + '/icons/head/0046.png', width: 40, height: 40 },
  { id: '0071', url: originPath + '/icons/head/0047.png', width: 40, height: 40 },
  { id: '0072', url: originPath + '/icons/head/0048.png', width: 40, height: 40 },
  { id: '0073', url: originPath + '/icons/head/0049.png', width: 40, height: 40 },
];

const barrageImagesGroup3: BarrageImage[] = [
  { id: '0074', url: originPath + '/icons/luming/0001.png', width: 40, height: 40 },
  { id: '0075', url: originPath + '/icons/luming/0002.png', width: 40, height: 40 },
  { id: '0076', url: originPath + '/icons/luming/0003.png', width: 40, height: 40 },
  { id: '0077', url: originPath + '/icons/luming/0004.png', width: 40, height: 40 },
  { id: '0078', url: originPath + '/icons/luming/0005.png', width: 40, height: 40 },
  { id: '0079', url: originPath + '/icons/luming/0006.png', width: 40, height: 40 },
  { id: '0080', url: originPath + '/icons/luming/0007.png', width: 40, height: 40 },
  { id: '0081', url: originPath + '/icons/luming/0008.png', width: 40, height: 40 },
  { id: '0082', url: originPath + '/icons/luming/0009.png', width: 40, height: 40 },
  { id: '0083', url: originPath + '/icons/luming/0010.png', width: 40, height: 40 },
  { id: '0084', url: originPath + '/icons/luming/0011.png', width: 40, height: 40 },
  { id: '0085', url: originPath + '/icons/luming/0012.png', width: 40, height: 40 },
  { id: '0086', url: originPath + '/icons/luming/0013.png', width: 40, height: 40 },
  { id: '0087', url: originPath + '/icons/luming/0014.png', width: 40, height: 40 },
  { id: '0088', url: originPath + '/icons/luming/0015.png', width: 40, height: 40 },
  { id: '0089', url: originPath + '/icons/luming/0016.png', width: 40, height: 40 },
];

export const barrageImages: BarrageImage[] = [
  ...barrageImagesGroup1,
  ...barrageImagesGroup2,
  ...barrageImagesGroup3
];

export const imageGroups: ImageGroups[] = [
  {
    id: 1,
    label: '通用',
    icon: { id: '0001', url: originPath + '/icons/common/0001.png', width: 75, height: 30 },
    images: barrageImagesGroup1,
  },
  {
    id: 2,
    label: '表情',
    icon: { id: '0025', url: originPath + '/icons/head/0001.png', width: 40, height: 40 },
    images: barrageImagesGroup2,
  },
  {
    id: 3,
    label: '鹿鸣',
    icon: { id: '0074', url: originPath + '/icons/luming/0001.png', width: 40, height: 40 },
    images: barrageImagesGroup3,
  },
]

/**
 * 获取弹幕相关数据
 */
export function generateBarrageData(videoId: number, config: generateBarrageConfig) {
  const {
    isFixed, isScroll, isSenior, isSpecial,
    fixedNum, scrollNum, seniorNum, specialNum,
  } = config;
  console.log(videoId);

  const textSections = [
    `读书不觉已春深`,
    `一寸光阴一寸金`,
    `不是道人来引笑`,
    `周情孔思正追寻`,
    `浮云一百八盘萦，落日四十八渡明。`,
    `得即高歌失即休，多愁多恨亦悠悠。`,
    `今朝有酒今朝醉，明日愁来明日愁。`,
    `生民何计乐樵苏。`,
    `待到秋来九月八，我花开后百花杀。`,
    `侯门一入深似海，从此萧郎是路人。`,
    `崆峒访道至湘湖，万卷诗书看转愚。`,
    `手帕蘑菇及线香，本资民用反为殃。`,
    `清风两袖朝天去，免得闾阎话短长。`,
    `春风得意马蹄疾，一日看尽长安花。`,
    `残灯无焰影幢幢，此夕闻君谪九江。`,
    `垂死病中惊坐起，暗风吹雨入寒窗。`,
    `新年快乐`,
    `更好的一年`,
    `继续努力`,
    `这泰裤辣`,
    `恭喜发财`,
  ];

  const blessingTextSections = [
    `新年快乐`,
    `灯笼起飞`,
    `不错`,
    `妙啊`,
    `希望所有人都梦想成真`,
    `阖家欢乐`,
    `太棒啦`,
    `前途似锦`,
    `考上好的大学`,
    `恭喜发财`,
  ];

  const colors = [
    '#FFFFFF',
    '#FE0302',
    '#FF7204',
    '#FFAA02',
    '#FFD302',
    '#FFFF00',
    '#A0EE00',
    '#00CD00',
    '#019899',
    '#4266BE',
    '#89D5FF',
    '#CC0273',
  ];

  // 弹幕数据
  const barrages: BarrageOptions[] = [];

  // 自动生成固定弹幕
  if (isFixed) {
    for(let i = 0; i < fixedNum;i++) {
      const time = Math.random() * 211 * 1000;
      barrages.push({
        id: uuid4(),
        barrageType: (i % 2) === 1 ? 'top' : 'bottom',
        time,
        text: `[${barrageImages[Math.floor(Math.random() * barrageImages.length)].id}]` + textSections[Math.floor(Math.random() * textSections.length)] + `[${barrageImages[Math.floor(Math.random() * barrageImages.length)].id}]`,
        // text: textSections[Math.floor(Math.random() * textSections.length)],
        fontSize: Math.random() < 0.1 ? 24 : 34,
        lineHeight: 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: 4000,
        addition: {
          grade: getRandomInt(1, 10),
        }
      })
    }
  }

  // 自动生成滚动弹幕
  if (isScroll) {
    for(let i = 1; i < scrollNum;i++) {
      const time = Math.random() * 211 * 1000;
      barrages.push({
        id: uuid4(),
        barrageType: 'scroll',
        time,
        text: `[${barrageImages[Math.floor(Math.random() * barrageImages.length)].id}]` + textSections[Math.floor(Math.random() * textSections.length)] + `[${barrageImages[Math.floor(Math.random() * barrageImages.length)].id}]`,
        // text: textSections[Math.floor(Math.random() * textSections.length)],
        fontSize: Math.random() < 0.1 ? 24 : 34,
        lineHeight: 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        addition: {
          grade: getRandomInt(1, 10),
        }
      })
    }
  }

  // 自动生成高级弹幕
  if (isSenior) {
    for(let i = 0; i < seniorNum;i++) {
      barrages.push({
        id: uuid4(),
        barrageType: 'senior',
        time: Math.random() * 211 * 1000,
        text: `[${barrageImages[Math.floor(Math.random() * barrageImages.length)].id}]` + textSections[Math.floor(Math.random() * textSections.length)] + `[${barrageImages[Math.floor(Math.random() * barrageImages.length)].id}]`,
        // text: textSections[Math.floor(Math.random() * textSections.length)],
        fontSize: getRandomInt(20, 50),
        lineHeight: 1.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        seniorBarrageConfig: {
          startLocation: {
            type: 'PERCENT',
            x: Math.random(),
            y: Math.random(),
          },
          endLocation: {
            type: 'PERCENT',
            x: Math.random(),
            y: Math.random(),
          },
          totalDuration: 6000,
          delay: 2000,
          motionDuration: 2000,
        },
        addition: {
          grade: getRandomInt(1, 10),
        }
      });
    }
  }

  // 生成自定义渲染弹幕
  if (isSpecial) {
    for(let i = 0; i < specialNum;i++) {
      // 0.1 ~ 0.9
      const startLocationX = Math.random() * 0.8 + 0.1;
      const text = blessingTextSections[Math.floor(Math.random() * blessingTextSections.length)];
      const fontSize = 20;
      const lineHeight = 1.2;
      const lanternWidth = 80;
      const lanternHeight = 80;
      const shifting = Math.random() * 0.1 + 0.1;
      barrages.push({
        id: uuid4(),
        barrageType: 'senior',
        time: Math.random() * 211 * 1000,
        text,
        fontSize,
        lineHeight,
        color: colors[Math.floor(Math.random() * colors.length)],
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
            x: Math.random() > 0.5 ? startLocationX + shifting : startLocationX - shifting,
            y: 0,
            offsetY: - (lanternHeight + text.length * (fontSize * lineHeight)),
          },
          totalDuration: 20000,
          delay: 0,
          motionDuration: 20000,
        },
      });
    }
  }

  return barrages;
}
