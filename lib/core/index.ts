import BarrageRenderer from '../index.ts';
import { BaseBarrage, BarrageOptions, FixedBarrage, ScrollBarrage, SeniorBarrage } from '../barrage/index';
import FixedBarrageLayout from './fixed-barrage-layout.ts';
import VirtualTrackAlgorithm from './virtual-track-algorithm';
import Utils from '../utils';

export type BarrageLayoutCalculateOptions = {
  barrageRenderer: BarrageRenderer
}

/**
 * 弹幕计算（用于滚动、顶部、底部、高级弹幕的计算）
 * 输入：弹幕数据、当前时间；
 * 输出：当前时间应该渲染的弹幕；
 */
export default class BarrageLayoutCalculate {
  br: BarrageRenderer;

  allBarrageInstances: BaseBarrage[] = [];
  fixedBarrageInstances: FixedBarrage[] = [];
  scrollBarrageInstances: ScrollBarrage[] = [];
  seniorBarrageInstances: SeniorBarrage[] = [];

  // 固定弹幕布局计算器
  fixedBarrageLayout: FixedBarrageLayout;

  virtualTrackAlgorithm: VirtualTrackAlgorithm;

  constructor({
    barrageRenderer,
  }: BarrageLayoutCalculateOptions) {
    this.br = barrageRenderer;

    this.fixedBarrageLayout = new FixedBarrageLayout(this.br);
    this.virtualTrackAlgorithm = new VirtualTrackAlgorithm(this.br);
  }

  /**
   * 设置弹幕数据
   * @param barrageOptions 弹幕配置数组
   */
  setBarrages(barrageOptions: BarrageOptions[]) {
    // 都转换成 class 实例
    let barrageInstances = barrageOptions.map(barrageOption => {
      switch (barrageOption.barrageType) {
        case 'top':
        case 'bottom':
          return new FixedBarrage(barrageOption, this.br);
        case 'scroll':
          return new ScrollBarrage(barrageOption, this.br);
        case 'senior':
          return new SeniorBarrage(barrageOption, this.br);
      }
    });
    barrageInstances = barrageInstances.sort((a, b) => a.time - b.time);

    // 设置各种弹幕实例数组
    this.allBarrageInstances = barrageInstances;
    this.scrollBarrageInstances = barrageInstances.filter(instance => instance.barrageType === 'scroll') as ScrollBarrage[];
    this.fixedBarrageInstances = barrageInstances.filter(instance => ['top', 'bottom'].includes(instance.barrageType)) as FixedBarrage[];
    this.seniorBarrageInstances = barrageInstances.filter(instance => instance.barrageType === 'senior') as SeniorBarrage[];

    // 使用虚拟轨道算法对滚动弹幕进行布局计算（计算 top）
    this.virtualTrackAlgorithm.layoutScrollBarrages(this.scrollBarrageInstances);
  }

  /**
   * 获取某一时刻需要渲染的弹幕，交由外部进行渲染
   * @param time 视频播放时间点
   */
  getRenderBarrages(time: number): BaseBarrage[] {
    // 获取需要渲染的滚动弹幕
    const renderScrollBarrages = this.getRenderScrollBarrages(time);
    // 获取需要渲染的固定弹幕
    const renderFixedBarrages = this.getRenderFixedBarrages(time);
    // 获取需要渲染的高级弹幕
    const renderSeniorBarrages = this.getRenderSeniorBarrages(time);
    // 整合排序
    return [
      ...renderScrollBarrages,
      ...renderFixedBarrages,
      ...renderSeniorBarrages,
    ].sort((a, b) => {
      if (a.prior !== b.prior) {
        // 如果 a 的 prior 为 true，则返回 1，否则返回 -1
        // 这意味着 true 的值会在最后面
        return a.prior ? 1 : -1;
      } else {
        // 如果 prior 属性相同，则按照 time 属性排序
        return a.time - b.time;
      }
    });
  }

  /**
   * 发送新的弹幕
   * @param barrage 弹幕配置对象
   */
  send(barrage: BarrageOptions) {
    // 根据弹幕类型进行不同的处理
    if (barrage.barrageType === 'scroll') {
      // 滚动弹幕
      const scrollBarrage = new ScrollBarrage(barrage, this.br);
      Utils.Algorithm.insertBarrageByTime(this.scrollBarrageInstances, scrollBarrage);
      this.virtualTrackAlgorithm.send(scrollBarrage);
    } else if (barrage.barrageType === 'top' || barrage.barrageType === 'bottom') {
      // 固定弹幕
      const fixedBarrage = new FixedBarrage(barrage, this.br);
      Utils.Algorithm.insertBarrageByTime(this.fixedBarrageInstances, fixedBarrage);
      this.fixedBarrageLayout.send(fixedBarrage);
    } else if (barrage.barrageType === 'senior') {
      // 高级弹幕
      const seniorBarrage = new SeniorBarrage(barrage, this.br);
      Utils.Algorithm.insertBarrageByTime(this.seniorBarrageInstances, seniorBarrage);
    }
  }

  /**
   * 获取当前应该渲染的滚动弹幕
   * @param time 视频播放时间点
   */
  getRenderScrollBarrages(time: number): ScrollBarrage[] {
    // 弹幕整体向左移动的总距离，时间 * 速度
    const translateX = (time / 1000) * this.br.renderConfig.speed;

    const renderScrollBarrages = this.scrollBarrageInstances.filter(barrage => barrage.show && barrage.top !== undefined).filter(barrage =>
      barrage.originalRight - translateX >= 0 &&
      barrage.originalLeft - translateX < this.br.canvasSize.width
    );

    renderScrollBarrages.forEach(barrage => {
      barrage.left = barrage.originalLeft - translateX;
    })

    return renderScrollBarrages;
  }

  /**
   * 获取当前应该渲染的固定弹幕
   * @param time 视频播放时间点
   */
  getRenderFixedBarrages(time: number): FixedBarrage[] {
    return this.fixedBarrageLayout.getRenderFixedBarrages(this.fixedBarrageInstances, time);
  }

  /**
   * 获取当前应该渲染的高级弹幕
   * @param time 视频播放时间点
   */
  getRenderSeniorBarrages(time: number): SeniorBarrage[] {
    // 获取当前能够渲染的高级弹幕
    const renderSeniorBarrages = this.seniorBarrageInstances.filter(barrage =>
      // 当前时间大于等于弹幕的出现时间 并且 当前时间小于等于弹幕的结束时间
      time >= barrage.time &&
      time <= (barrage.time + barrage.seniorBarrageConfig.totalDuration)
    );

    // 遍历计算高级弹幕的 top 和 left
    renderSeniorBarrages.forEach(barrage => {
      const startPoint = barrage.time;
      const delayEndPoint = startPoint + barrage.seniorBarrageConfig.delay;
      const motionEndPoint = delayEndPoint + barrage.seniorBarrageConfig.motionDuration;

      if (time >= startPoint && time <= delayEndPoint) {
        // delay 时间段内（渲染在开始点即可）
        barrage.left = barrage.actualStartLocation.x;
        barrage.top = barrage.actualStartLocation.y;
      } else if (time >= delayEndPoint && time <= motionEndPoint) {
        // motion 时间段内
        // 当前的运动时长
        const motionTime = time - delayEndPoint;
        barrage.left = barrage.actualStartLocation.x + motionTime * barrage.vx;
        barrage.top = barrage.actualStartLocation.y + motionTime * barrage.vy;
      } else {
        // 运动结束时间段内（渲染在结束点即可）
        barrage.left = barrage.actualEndLocation.x;
        barrage.top = barrage.actualEndLocation.y;
      }
    });

    return renderSeniorBarrages;
  }

  /**
   * 处理宽度 change
   */
  private handleWidthChange() {
    // 固定弹幕 -- 重新计算 left
    this.fixedBarrageInstances.forEach(barrage => barrage.calcFixedBarrageLeft());
    // 滚动弹幕 -- 重新计算 originalLeft
    this.scrollBarrageInstances.forEach(barrage => barrage.calcOriginal());
  }

  /**
   * 处理高度 change
   */
  private handleHeightChange () {
    // 固定弹幕 -- 清空现有的即可
    this.fixedBarrageLayout.clearStoredBarrage();
    // 滚动弹幕 -- 布局完全重新计算
    this.virtualTrackAlgorithm.heightChangeReLayoutCalc(this.scrollBarrageInstances);
  }

  /**
   * 尺寸发生变化的时候调用，会重新计算内部数据
   * @param type 尺寸变化的类型
   */
  resize(type: 'ONLY_WIDTH' | 'ONLY_HEIGHT' | 'BOTH') {
    // 高级弹幕的 start 和 end 定位全部重新计算
    this.seniorBarrageInstances.forEach(barrage => barrage.calcActualLocation());
    if (type === 'ONLY_WIDTH') {
      this.handleWidthChange();
    } else if (type === 'ONLY_HEIGHT') {
      this.handleHeightChange();
    } else {
      this.handleWidthChange();
      this.handleHeightChange();
    }
  }

  /**
   * 根据 render Config change 进行布局方面的重新计算
   * @param isSpeedChange        重新计算 originalLeft，如果当前是不允许遮挡的话，重新进行虚拟轨道计算；
   * @param isHeightReduceChange 重置轨道数据，根据 avoidOverlap 进行重新布局，清空固定弹幕的 store
   * @param isRenderRegionChange 重置轨道数据，根据 avoidOverlap 进行重新布局
   * @param isAvoidOverlapChange  					根据 avoidOverlap 进行重新布局
   * @param isMinSpaceChange     如果当前是不允许遮挡的话，重新进行虚拟轨道计算；
   */
  renderConfigChange(
    isSpeedChange: boolean,
    isHeightReduceChange: boolean,
    isRenderRegionChange: boolean,
    isAvoidOverlapChange: boolean,
    isMinSpaceChange: boolean,
  ) {
    // 重新计算 originalLeft 事项
    if (isSpeedChange) {
      this.scrollBarrageInstances.forEach(barrage => barrage.calcOriginal());
    }
    // 清空固定弹幕的 store 事项
    if (isHeightReduceChange) {
      this.fixedBarrageLayout.clearStoredBarrage();
    }
    // 重置轨道数据 事项
    if (isHeightReduceChange || isRenderRegionChange) {
      this.virtualTrackAlgorithm.resetTracks();
    }
    // 根据 avoidOverlap 进行重新布局 事项
    if (
      (isSpeedChange && this.br.renderConfig.avoidOverlap) ||
      isHeightReduceChange ||
      isRenderRegionChange ||
      isAvoidOverlapChange ||
      (isMinSpaceChange && this.br.renderConfig.avoidOverlap)
    ) {
      this.virtualTrackAlgorithm.layoutScrollBarrages(this.scrollBarrageInstances);
    }
  }
}
