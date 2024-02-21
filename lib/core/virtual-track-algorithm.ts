import BarrageRenderer from '../index.ts';
import { ScrollBarrage } from '../barrage';
import Utils from '../utils';

/**
 * 虚拟轨道弹幕布局算法（用于滚动弹幕的计算）
 */
export default class VirtualTrackAlgorithm {
  // 全局弹幕渲染器
  br: BarrageRenderer;

  // 实际轨道数组
  realTracks: RealTrack[] = [];
  // 虚拟轨道数组
  virtualTracks: VirtualTrack[] = [];

  // 实际轨道的高度
  realTrackHeight!: number;
  // 实际轨道的数量
  realTrackNum!: number;

  // 最高弹幕所占虚拟轨道的 grade
  maxGrade!: number;

  // 以空间换时间，性能优化
  // key：任意虚拟轨道；value：包含 virtualTrack 内部任一实际轨道的虚拟轨道所组成的数组
  vtToVtsMap = new Map<VirtualTrack, VirtualTrack[]>();
  gradeToVtsMap = new Map<number, VirtualTrack[]>();

  constructor(barrageRenderer: BarrageRenderer) {
    this.br = barrageRenderer;
  }

  /**
   * 根据 br 的数据初始化实际轨道和虚拟轨道
   * @param realTrackHeight 实际轨道高度
   */
  initTracks(realTrackHeight: number) {
    this.resetTracks();
    // 实际轨道的数量
    const realTrackNum = Math.floor(this.br.canvasSize.height * this.br.renderConfig.renderRegion / realTrackHeight);

    this.realTrackHeight = realTrackHeight;
    this.realTrackNum = realTrackNum;

    // 创建 realTrackNum 个实际轨道
    for (let i = 1; i <= realTrackNum; i++) {
      this.realTracks.push(new RealTrack(i, realTrackHeight));
    }

    // 创建虚拟轨道
    // 实际轨道的 id 数组
    const realTrackIds = this.realTracks.map(realTrack => realTrack.id);
    let virtualTrackId = 1;
    // 虚拟轨道的级别 1 ~ realTrackNum
    for (let grade = 1; grade <= realTrackNum; grade++) {
      // 创建级别为 i 的虚拟轨道
      // 级别为 grade 虚拟轨道的个数是
      const iVirtualTrackNum = realTrackNum - (grade - 1);
      for (let i = 1; i <= iVirtualTrackNum; i++) {
        this.virtualTracks.push(new VirtualTrack(
            virtualTrackId++,
            realTrackIds.slice(i - 1, (i - 1) + grade),
            this.realTracks.slice(i - 1, (i - 1) + grade),
          )
        );
      }
    }
    // 日志打印
    this.isLogKeyData && console.table([
      { item: '实际轨道高度', value: realTrackHeight },
      { item: '实际轨道数量', value: this.realTracks.length },
      { item: '虚拟轨道数量', value: this.virtualTracks.length },
    ]);
    // 构造数据结构，以空间换时间
    this.virtualTracks.forEach(virtualTrack => {
      this.vtToVtsMap.set(virtualTrack, this.virtualTracks.filter(item => item.grade <= this.maxGrade && virtualTrack.rtIdArr.some(id => item.rtIdSet.has(id))));
    })
    for (let grade = 1; grade <= realTrackNum; grade++) {
      this.gradeToVtsMap.set(grade, this.virtualTracks.filter(item => item.grade === grade));
    }
  }

  /**
   * 对滚动弹幕进行布局计算
   * @param scrollBarrages 滚动弹幕实例数组
   */
  layoutScrollBarrages(scrollBarrages: ScrollBarrage[]) {
    if (scrollBarrages.length === 0) return;
    // 实际轨道的高度
    const realTrackHeight = Utils.Math.findMode(scrollBarrages.map(barrage => Math.ceil(barrage.height)));
    // 计算最高弹幕所占虚拟轨道的 grade
    this.maxGrade = Math.ceil(Math.max(...scrollBarrages.map(barrage => barrage.height)) / realTrackHeight!);
    // 先判断当前有没有进行虚拟轨道和实际轨道的初始化，没有的话，进行初始化
    if (!this.realTracks.length || !this.virtualTracks.length) {
      // 计算实际轨道的高度，出于性能以及弹幕实际渲染效果的考虑，取所有弹幕高度向上取整的众数；
      this.initTracks(realTrackHeight!);
    }

    // 计算所有滚动弹幕实际占据几个实际轨道
    scrollBarrages.forEach(barrage => {
      barrage.grade = Math.ceil(barrage.height / realTrackHeight!);
    })

    // 进行布局处理
    if (this.avoidOverlap) {
      this.avoidOverlapLayout(scrollBarrages);
    } else {
      this.allowOverlapLayout(scrollBarrages);
    }
  }

  /**
   * 进行不允许重叠的布局
   * @param scrollBarrages 滚动弹幕实例数组
   */
  avoidOverlapLayout(scrollBarrages: ScrollBarrage[]) {
    const startTime = Date.now();
    // 将所有虚拟轨道中的存储弹幕清空
    this.virtualTracks.forEach(vt => vt.clearBarrage());
    // 遍历进行布局计算
    scrollBarrages.forEach(barrage => {
      // 遍历 grade 属性为 grade 的虚拟轨道，判断能不能放进去
      const fittedVirtualTracks = this.gradeToVtsMap.get(barrage.grade) || [];
      for (let i = 0; i < fittedVirtualTracks.length; i++) {
        // 当前遍历的 virtualTrack
        const virtualTrack = fittedVirtualTracks[i];
        // 判断当前遍历的 virtualTrack 能不能放进去；
        // 能放进去的条件是：包含 virtualTrack 内部任一实际轨道的虚拟轨道（grade <= maxGrade）的最后一个弹幕和当前新增弹幕都不重叠
        const canPush = (this.vtToVtsMap.get(virtualTrack) || []).every(item => {
          // 获取最后一个滚动弹幕
          const lastScrollBarrage = item.getLastBarrage();
          // 如果当前轨道没有滚动弹幕的话，说明和最后一个弹幕不可能重叠，直接 return true 即可
          if (!lastScrollBarrage) return true;
          // 有的话，判断是否会重叠
          return lastScrollBarrage.originalRight + this.minSpace <= barrage.originalLeft;
        });
        if (canPush) {
          barrage.show = true;
          virtualTrack.push(barrage);
          // 计算该滚动弹幕的 top
          barrage.top = virtualTrack.top;
          break;
        } else {
          barrage.show = false;
        }
      }
      // 重要的弹幕，如果没有虚拟轨道能插进去的话，则随机一个实际轨道
      if (barrage.prior && !barrage.show) {
        this.randomTrackBarrage(barrage);
      }
    });
    this.isLogKeyData && console.log(`虚拟轨道算法花费时间：${(Date.now() - startTime)}ms`);
  }

  /**
   * 进行允许重叠的布局
   * @param scrollBarrages 滚动弹幕实例数组
   */
  allowOverlapLayout(scrollBarrages: ScrollBarrage[]) {
    scrollBarrages.forEach(barrage => {
      this.randomTrackBarrage(barrage);
    });
  }

  /**
   * 不允许重叠，插入新的弹幕
   * @param scrollBarrage 滚动弹幕实例
   */
  avoidOverlapInsert(scrollBarrage: ScrollBarrage) {
    let inserted = false;
    // 获取所有符合当前弹幕高度的虚拟轨道
    const fittedVirtualTracks = this.gradeToVtsMap.get(scrollBarrage.grade) || [];
    // 进行遍历，看有没有能插入的
    for (let i = 0; i < fittedVirtualTracks.length; i++) {
      // 判断当前遍历的 virtualTrack 能不能放进去
      const virtualTrack = fittedVirtualTracks[i];
      // 如果当前的虚拟轨道为空的话，直接放进去即可
      if (virtualTrack.isEmpty) {
        scrollBarrage.show = true;
        virtualTrack.push(scrollBarrage);
        scrollBarrage.top = virtualTrack.top;
        inserted = true;
        break;
      } else {
        // 虚拟轨道中已经有弹幕，判断当前弹幕是不是在第一个弹幕的前面
        if (scrollBarrage.originalLeft < virtualTrack.getByIndex(0).originalLeft) {
          if (scrollBarrage.originalRight + this.minSpace < virtualTrack.getByIndex(0).originalLeft) {
            // 放到当前虚拟轨道的最前面
            scrollBarrage.show = true;
            virtualTrack.barrages.unshift(scrollBarrage);
            scrollBarrage.top = virtualTrack.top;
            inserted = true;
            break;
          }
        } else {
          const insertBeforeIndex = virtualTrack.barrages.findIndex((
            barrage,
            index,
            arr
          ) => {
            // barrage  scrollBarrage  nextBarrage
            const nextBarrage = arr[index + 1];
            return barrage.originalLeft < scrollBarrage.originalLeft && (!nextBarrage || scrollBarrage.originalLeft < nextBarrage.originalLeft);
          });
          if (insertBeforeIndex !== -1) {
            const insertBeforeBarrage = virtualTrack.barrages[insertBeforeIndex];
            const insertAfterBarrage = virtualTrack.barrages[insertBeforeIndex + 1];
            if (
              insertBeforeBarrage.originalRight + this.minSpace < scrollBarrage.originalLeft &&
              (!insertAfterBarrage || scrollBarrage.originalRight + this.minSpace < insertAfterBarrage.originalLeft)
            ) {
              scrollBarrage.show = true;
              virtualTrack.barrages.splice(insertBeforeIndex + 1, 0, scrollBarrage);
              scrollBarrage.top = virtualTrack.top;
              inserted = true;
              break;
            }
          }
        }
      }
    }
    // 如果没有插入成功的话，随机一个实际轨道的 top
    if (!inserted) {
      this.randomTrackBarrage(scrollBarrage);
    }
  }

  /**
   * 发送新的弹幕
   * @param scrollBarrage 滚动弹幕实例
   */
  send(scrollBarrage: ScrollBarrage) {
    scrollBarrage.grade = Math.ceil(scrollBarrage.height / this.realTrackHeight);
    // 根据当前的禁止遮挡配置进行不同的处理
    if (this.br.renderConfig.avoidOverlap) {
      // 不允许遮挡，遍历虚拟轨道，看有没有能插入进去的，如果没有的话，随机设置一个实际轨道的高度。
      // 新发送的弹幕出于性能以及实际的效果的考虑，并没有执行严格的虚拟轨道算法计算，
      // 因为不可能因为没有地方插入，就不让用户发送弹幕了，这在产品的角度上也是不合理的。
      this.avoidOverlapInsert(scrollBarrage);
    } else {
      this.randomTrackBarrage(scrollBarrage);
    }
  }

  /**
   * 重置存放 实际轨道 和 虚拟轨道 的数组
   */
  resetTracks() {
    this.realTracks = [];
    this.virtualTracks = [];
    this.vtToVtsMap.clear();
    this.gradeToVtsMap.clear();
  }

  /**
   * 处理高度变化重新进行布局计算
   * @param scrollBarrages 滚动弹幕实例数组
   */
  heightChangeReLayoutCalc(scrollBarrages: ScrollBarrage[]) {
    // 重置轨道数据
    this.resetTracks();

    // 重新进行计算
    this.layoutScrollBarrages(scrollBarrages);
  }

  /**
   * 随机一个实际轨道并设置弹幕
   * @param barrage 滚动弹幕实例
   */
  randomTrackBarrage(barrage: ScrollBarrage) {
    const randomRealTrack = this.getRandomRealTrack();
    barrage.top = randomRealTrack.top;
    barrage.show = true;
  }

  /**
   * 是否允许弹幕相互重叠
   */
  get avoidOverlap() {
    return this.br.renderConfig.avoidOverlap;
  }

  /**
   * 是否打印关键数据
   */
  get isLogKeyData() {
    return this.br.devConfig.isLogKeyData;
  }

  /**
   * 获取一个随机的实际轨道
   */
  getRandomRealTrack() {
    return this.realTracks[Utils.Math.getRandomInt(0, this.realTracks.length - 1)];
  }

  /**
   * 获取滚动弹幕的最小间距
   */
  get minSpace() {
    return this.br.renderConfig.minSpace;
  }
}

/**
 * 用于描述实际轨道
 */
class RealTrack {
  // 实际轨道的唯一 id
  id: number;
  // 实际轨道的高度
  height: number;

  constructor(id: number, height: number) {
    this.id = id;
    this.height = height;
  }

  /**
   * 当前实际轨道的 top
   */
  get top() {
    return (this.id - 1) * this.height;
  }
}

/**
 * 用于描述虚拟轨道，虚拟轨道是实际轨道或者实际轨道的相邻合并
 */
class VirtualTrack {
  // 虚拟轨道的唯一 id
  id: number;
  // 当前虚拟轨道包含的实际轨道，数组形式
  rtIdArr: number[];
  rtIdSet: Set<number>;
  rtInstanceArr: RealTrack[];

  // 当前虚拟轨道包含的滚动弹幕
  barrages: ScrollBarrage[] = [];

  constructor(id: number, rtIdArr: number[], rtInstanceArr: RealTrack[]) {
    this.id = id;

    this.rtIdArr = rtIdArr;
    this.rtIdSet = new Set(rtIdArr);

    this.rtInstanceArr = rtInstanceArr;
  }

  /**
   * 获取轨道中的最后一个滚动弹幕
   */
  getLastBarrage(): ScrollBarrage | undefined {
    return this.barrages[this.barrages.length - 1];
  }

  /**
   * 向虚拟轨道中添加新的滚动弹幕
   * @param barrage
   */
  push(barrage: ScrollBarrage) {
    this.barrages.push(barrage);
  }

  /**
   * 清空所有的弹幕
   */
  clearBarrage() {
    this.barrages = [];
  }

  /**
   * 获取指定下标的滚动弹幕
   * @param index
   */
  getByIndex(index: number) {
    return this.barrages[index];
  }

  /**
   * 当前虚拟轨道的级别（包含虚拟轨道的数量）
   */
  get grade() {
    return this.rtIdArr.length;
  }

  /**
   * 当前弹幕是不是空的
   */
  get isEmpty() {
    return this.barrages.length === 0;
  }

  /**
   * 当前虚拟轨道的 top
   */
  get top() {
    return this.rtInstanceArr[0].top;
  }
}
