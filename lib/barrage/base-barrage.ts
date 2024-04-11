import BarrageRenderer, { BarrageImage } from '../index.ts';
import Utils from '../utils';

/**
 * 构造函数参数对象
 */
export type BaseBarrageOptions = {
  // 弹幕的唯一标识
  id: string;
  // 弹幕的出现时间（毫秒为单位）
  time: number;
  // 弹幕的内容（eg：文本内容[图片id]文本内容[图片id]文本内容）
  text: string;
  // 弹幕的字体大小
  fontSize: number;
  // 弹幕的行高
  lineHeight: number;
  // 弹幕颜色
  color: string;
  // 是不是重要的
  prior?: boolean;
  // 自定义 render 相关配置
  customRender?: CustomRender;
  // 额外，附加的信息
  addition?: {
    [key: string]: any
  }
}

/**
 * 弹幕类
 */
export default abstract class BaseBarrage {
  // 弹幕的唯一标识
  id: string;
  // 弹幕的类型
  readonly abstract barrageType: BarrageType;
  // 弹幕的出现时间（毫秒为单位）
  time: number;
  // 弹幕的内容
  text: string;
  // 弹幕的字体大小
  fontSize: number;
  // 弹幕的行高
  lineHeight: number;
  // 弹幕颜色
  color: string;
  // 是不是重要的
  prior: boolean;
  // 自定义 render 相关配置
  customRender?: CustomRender;
  // 额外，附加的信息
  addition?: Record<string, any>;

  // 渲染器实例
  br: BarrageRenderer;

  // 用于描述渲染时弹幕整体的 top 和 left
  top!: number;
  left!: number;

  // 用于描述弹幕整体的尺寸
  width!: number;
  height!: number;

  // 根据 text 解析成的片段数组
  sections: Section[] = [];

  protected constructor({
    id,
    time,
    text,
    fontSize,
    lineHeight,
    color,
    prior = false,
    customRender,
    addition,
  }: BaseBarrageOptions, barrageRenderer: BarrageRenderer) {
    this.id = id;
    this.time = time;
    this.text = text;
    this.fontSize = fontSize;
    this.lineHeight = lineHeight;
    this.color = color;
    this.prior = prior;
    this.customRender = customRender;
    this.addition = addition;

    this.br = barrageRenderer;

    this.initBarrage()
  }

  /**
   * 进行当前弹幕相关数据的计算
   */
  initBarrage() {
    const sectionObjects = this.analyseText(this.text);
    let barrageImage;

    // 整个弹幕的宽
    let totalWidth = 0;
    // 整个弹幕的高
    let maxHeight = 0;

    // 计算转换成 sections
    const sections: Section[] = [];
    sectionObjects.forEach(sectionObject => {
      // 判断是文本片段还是图片片段
      if (sectionObject.type === 'image' && (barrageImage = this.br.barrageImages?.find(bi => `[${bi.id}]` === sectionObject.value))) {
        totalWidth += barrageImage.width;
        maxHeight = maxHeight < barrageImage.height ? barrageImage.height : maxHeight;

        // 构建图片片段
        sections.push(new ImageSection({
          ...barrageImage,
          leftOffset: Utils.Math.sum(sections.map(section => section.width)),
        }));
      } else {
        // 设置好文本状态后，进行文本的测量
        this.setCtxFont(this.br.ctx);
        const textWidth = this.br.ctx?.measureText(sectionObject.value).width || 0;
        const textHeight = this.fontSize * this.lineHeight;

        totalWidth += textWidth;
        maxHeight = maxHeight < textHeight ? textHeight : maxHeight;

        // 构建文本片段
        sections.push(new TextSection({
          text: sectionObject.value,
          width: textWidth,
          height: textHeight,
          leftOffset: Utils.Math.sum(sections.map(section => section.width)),
        }));
      }
    })
    this.sections = sections;

    // 设置当前弹幕的宽高，如果自定义中定义了的话，则取自定义中的 width 和 height，因为弹幕实际呈现出来的 width 和 height 是由渲染方式决定的
    this.width = this.customRender?.width ?? totalWidth;
    this.height = this.customRender?.height ?? maxHeight;

    // 遍历计算各个 section 的 topOffset
    this.sections.forEach(item => {
      if (item.sectionType === 'text') {
        item.topOffset = (this.height - this.fontSize) / 2;
      } else {
        item.topOffset = (this.height - item.height) / 2;
      }
    });
  }

  /**
   * 解析 text 内容
   * 文本内容[图片id]文本内容[图片id] => ['文本内容', '[图片id]', '文本内容', '[图片id]']
   * @param barrageText 弹幕文本
   */
  analyseText(barrageText: string): Segment[] {
    const segments: Segment[] = [];

    // 字符串解析器
    while (barrageText) {
      // 尝试获取 ]
      const rightIndex = barrageText.indexOf(']');
      if (rightIndex !== -1) {
        // 能找到 ]，尝试获取 rightIndex 前面的 [
        const leftIndex = barrageText.lastIndexOf('[', rightIndex);
        if (leftIndex !== -1) {
          // [ 能找到
          if (leftIndex !== 0) {
            // 如果不等于 0 的话，说明前面是 text
            segments.push({
              type: 'text',
              value: barrageText.slice(0, leftIndex),
            })
          }
          segments.push({
            type: rightIndex - leftIndex > 1 ? 'image' : 'text',
            value: barrageText.slice(leftIndex, rightIndex + 1),
          });
          barrageText = barrageText.slice(rightIndex + 1);
        } else {
          // [ 找不到
          segments.push({
            type: 'text',
            value: barrageText.slice(0, rightIndex + 1),
          })
          barrageText = barrageText.slice(rightIndex + 1);
        }
      } else {
        // 不能找到 ]
        segments.push({
          type: 'text',
          value: barrageText,
        });
        barrageText = '';
      }
    }

    // 相邻为 text 类型的需要进行合并
    const finalSegments: Segment[] = [];
    let currentText = '';
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].type === 'text') {
        currentText += segments[i].value;
      } else {
        if (currentText !== '') {
          finalSegments.push({ type: 'text', value: currentText });
          currentText = '';
        }
        finalSegments.push(segments[i]);
      }
    }
    if (currentText !== '') {
      finalSegments.push({ type: 'text', value: currentText });
    }

    return finalSegments;
  }

  /**
   * 将当前弹幕渲染到指定的上下文
   * @param ctx 渲染上下文
   */
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    ctx.beginPath();
    // 如果当前弹幕是自定义渲染弹幕的话，则触发执行自定义渲染函数
    if (this.customRender) {
      this.customRender.renderFn({
        ctx,
        barrage: this,
        br: this.br,
        imageElementFactory: Utils.Cache.imageElementFactory,
      });
      return;
    }

    // 辅助开发的弹幕边框，用于确定弹幕的渲染大小
    if (this.br.devConfig.isRenderBarrageBorder) {
      ctx.strokeStyle = '#FF0000';
      ctx.strokeRect(this.left, this.top, this.width, this.height);
    }

    // 如果是重要弹幕的话，需要渲染一个边框，例如当前用户自己发送的弹幕，就应该渲染边框作为明显的标识
    if (this.prior) {
      if (this.br.renderConfig.priorBorderCustomRender) {
        // 如果提供了边框的自定义渲染函数的话，则使用自定义渲染函数进行渲染
        this.br.renderConfig.priorBorderCustomRender({
          ctx,
          barrage: this,
          br: this.br,
          imageElementFactory: Utils.Cache.imageElementFactory,
        })
      } else {
        // 否则使用默认渲染
        ctx.strokeStyle = '#89D5FF';
        ctx.strokeRect(this.left, this.top, this.width, this.height);
      }
    }
  
    // 绘制弹幕内容
    // 设置绘图上下文
    this.setCtxFont(ctx);
    ctx.fillStyle = this.color;
    // 遍历当前弹幕的 sections
    this.sections.forEach(section => {
      if (section.sectionType === 'text') {
        ctx.fillText(section.text, this.left + section.leftOffset, this.top + section.topOffset);
      } else if (section.sectionType === 'image') {
        ctx.drawImage(
          Utils.Cache.imageElementFactory(section.url),
          this.left + section.leftOffset,
          this.top + section.topOffset,
          section.width,
          section.height,
        )
      }
    })
  }

  /**
   * 设置上下文的 font 属性
   * @param ctx 渲染上下文
   */
  setCtxFont(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    ctx.font = `${this.br.renderConfig.fontWeight} ${this.fontSize}px ${this.br.renderConfig.fontFamily}`;
  }
}

/**
 * 自定义 render 函数的参数
 */
export type CustomRenderOptions = {
  // 渲染上下文
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  // 渲染的弹幕实例
  barrage: BaseBarrage;
  // 渲染器实例
  br: BarrageRenderer;
  // 缓存获取图片的工厂方法
  imageElementFactory: (url: string) => HTMLImageElement,
}

/**
 * 自定义 render 函数
 */
export type RenderFn = (options: CustomRenderOptions) => void;

/**
 * 自定义 render 相关配置
 */
export type CustomRender = {
  // 弹幕的宽（弹幕实际的宽由具体的渲染操作决定，所以这里由用户自行传入）
  width: number;
  // 弹幕的高（弹幕实际的高由具体的渲染操作决定，所以这里由用户自行传入）
  height: number;
  // 弹幕自定义渲染函数
  renderFn: RenderFn;
}

/**
 * 解析完成的片段
 */
export type Segment = {
  type: 'text' | 'image',
  value: string
}

/**
 * 描述弹幕内容中的文本片段
 */
export type TextSectionOptions = {
  // 文本片段的内容
  text: string;
  // 这段文本的宽高
  width: number;
  height: number;
  // 当前片段相较于整体弹幕 top 和 left 的偏移量
  topOffset?: number;
  leftOffset: number;
}

export class TextSection {
  readonly sectionType = 'text';
  text: string;
  width: number;
  height: number;
  topOffset!: number;
  leftOffset: number;

  constructor({
    text,
    width,
    height,
    leftOffset,
  }: TextSectionOptions) {
    this.text = text;
    this.width = width;
    this.height = height;
    this.leftOffset = leftOffset;
  }
}

/**
 * 描述弹幕内容中的图片片段
 */
export type ImageSectionOptions = BarrageImage & {
  // 当前片段相较于整体弹幕 top 和 left 的偏移量
  topOffset?: number;
  leftOffset: number;
}

export class ImageSection {
  readonly sectionType = 'image';
  id: string;
  url: string;
  width: number;
  height: number;
  topOffset!: number;
  leftOffset: number;

  constructor({
    id,
    url,
    width,
    height,
    leftOffset,
  }: ImageSectionOptions) {
    this.id = id;
    this.url = url;
    this.width = width;
    this.height = height;
    this.leftOffset = leftOffset;
  }
}

export type Section = TextSection | ImageSection;

/**
 * 弹幕的类型
 * scroll：滚动弹幕
 * top：顶部弹幕
 * bottom：底部弹幕
 * senior：高级弹幕
 */
export type BarrageType = 'scroll' | 'top' | 'bottom' | 'senior';
