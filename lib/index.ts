import { BarrageOptions } from './barrage';
import Utils from './utils';
import BarrageLayoutCalculate from './core';
import { BaseBarrage } from './barrage';
import { ErrorCode, BarrageOptionError } from './errors';

/**
 * 弹幕渲染器
 */
export default class BarrageRenderer {
	// 容器 DOM
	container: HTMLElement | null;
	// video 元素
	video: HTMLVideoElement;
	// Canvas 元素
	canvas: HTMLCanvasElement;
	// Canvas 渲染上下文;
	ctx: CanvasRenderingContext2D;
	// 弹幕中渲染图片的配置
	barrageImages?: BarrageImage[];
	// 渲染配置
	renderConfig!: RenderConfig;
	// 开发相关配置
	devConfig!: DevConfig;
	// 弹幕布局计算器
	barrageLayoutCalculate = new BarrageLayoutCalculate({
		barrageRenderer: this,
	});

	// 用于标识弹幕功能是否被打开
	isOpen = true

	animationHandle?: number;

	fps = '';
	lastFrameTime?: number;
	lastCalcTime = 0;

	// 记录上次布局计算时，container 的宽高
	lastContainerSize = { width: 0, height: 0 };

	// 离屏 canvas 优化
	isSupportOffscreenCanvas = Utils.Canvas.isSupportOffscreenCanvas();
	offscreenCanvas?: OffscreenCanvas;
	offscreenCanvasCtx?: OffscreenCanvasRenderingContext2D;
	
	constructor({
		container,
		video,
		barrages,
		barrageImages,
		renderConfig,
		devConfig,
	}: RendererOptions) {
		this.video = video;

		// 先设置好渲染配置
		this.setRenderConfigInternal(renderConfig || {}, true);
		// 先设置好开发配置
		this.setDevConfig(devConfig || {});

		// 设置渲染图片
		this.barrageImages = barrageImages;

		// 创建、处理相关 DOM
		this.container =
			typeof container === 'string'
			? document.getElementById(container)
			: container;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		if (this.isSupportOffscreenCanvas) {
			this.offscreenCanvas = new OffscreenCanvas(100, 100);
			this.offscreenCanvasCtx = this.offscreenCanvas.getContext('2d');
		}
		this.handleDOM(this.container, this.canvas, this.ctx);

		// 设置弹幕数据
		this.setBarrages(barrages);

		this.devConfig.isLogKeyData && console.log('全局实例：', this);
	}

	/**
	 * 处理 DOM 相关
	 * @param container 容器 DOM 元素
	 * @param canvas canvas 元素
	 * @param ctx 渲染上下文
	 */
	private handleDOM(container: HTMLElement | null, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D | null) {
		if (!container) console.error('Unable to obtain container element');
		if (!ctx) console.error('Unable to obtain CanvasRenderingContext2D');
		if (!container || !ctx) return;
		// 设置容器
		container.style.position = 'relative';

		// 设置 canvas
		canvas.style.position = 'absolute';
		canvas.style.left = '0px';
		canvas.style.top = '0px';
		canvas.style.pointerEvents = 'none';
		canvas.width = container.clientWidth;
		canvas.height = container.clientHeight - (this.renderConfig.heightReduce ?? 0);

		// 将 canvas 添加到 container 中
		container.appendChild(canvas);
		
		this.handleHighDprVague(canvas, ctx);
		
		// 需要同步处理离屏 canvas
		if (this.isSupportOffscreenCanvas) {
			this.offscreenCanvas.width = container.clientWidth;
			this.offscreenCanvas.height = container.clientHeight - (this.renderConfig.heightReduce ?? 0);
		}
	}
	
	/**
	 * 处理 Canvas 在高分屏上渲染模糊的问题
	 */
	private handleHighDprVague(canvas: HTMLCanvasElement | OffscreenCanvas, ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
		// 先获取设备 dpr
		const dpr = Utils.Canvas.getDevicePixelRatio();
		const logicalWidth = canvas.width;
		const logicalHeight = canvas.height;
		canvas.width = logicalWidth * dpr;
		canvas.height = logicalHeight * dpr;
		canvas.style.width = logicalWidth + 'px';
		canvas.style.height = logicalHeight + 'px';
		
		ctx.scale(dpr, dpr);
		ctx.textBaseline = 'hanging';
	}
	
	/**
	 * 发送新的弹幕
	 * @param barrage 弹幕配置对象
	 */
	send(barrage: BarrageOptions) {
		const validateResult = this.validateBarrageOption(barrage);
		if (validateResult !== true) {
			throw validateResult;
		}
		barrage.prior = true;
		this.barrageLayoutCalculate.send(barrage);
	}

	/**
	 * container 元素尺寸变更后，调用进行重新计算
	 */
	resize() {
		// 先处理 DOM 相关
		this.handleDOM(this.container, this.canvas, this.ctx);

		const nowContainerSize = {
			width: this.container?.clientWidth || 0,
			height: this.container?.clientHeight || 0,
		}
		const { width, height } = this.lastContainerSize;

		const widthIsDiff = width !== nowContainerSize.width;
		const heightIsDiff = height !== nowContainerSize.height;

		if (widthIsDiff || heightIsDiff) {
			this.lastContainerSize = nowContainerSize;
			// 仅仅宽度发生了变化
			if (widthIsDiff && !heightIsDiff) {
				this.barrageLayoutCalculate.resize('ONLY_WIDTH');
			} else if (!widthIsDiff && heightIsDiff) {
				this.barrageLayoutCalculate.resize('ONLY_HEIGHT');
			} else {
				this.barrageLayoutCalculate.resize('BOTH');
			}
		}
		// 触发一帧的渲染
		this.renderFrame();
	}

	/**
	 * 设置弹幕数据
	 * @param barrages 弹幕配置对象数组
	 */
	setBarrages(barrages?: BarrageOptions[]) {
		// 如果没有弹幕数据的话，直接 return
		if (!barrages) return;

		// 对不合规范的弹幕数据进行过滤
		barrages = barrages.filter(barrage => {
			return this.validateBarrageOption(barrage) === true;
		});

		// 使用弹幕布局计算器进行计算
		this.barrageLayoutCalculate.setBarrages(barrages);

		// 记录此时的宽和高
		this.lastContainerSize = {
			width: this.container?.clientWidth || 0,
			height: this.container?.clientHeight || 0,
		}
	}

	/**
	 * 设置渲染配置（可以部分设置配置）
	 * @param renderConfig 配置对象
	 * @param init 是不是初始化
	 */
	private setRenderConfigInternal(renderConfig: Partial<RenderConfig>, init = false) {
		if (!this.renderConfig) this.renderConfig = DEFAULT_RENDER_CONFIG;

		const renderConfigKeys = Object.keys(renderConfig);
		const isSpeedChange = renderConfigKeys.includes('speed') && renderConfig.speed !== this.renderConfig.speed;
		const isHeightReduceChange = renderConfigKeys.includes('heightReduce') && renderConfig.heightReduce !== this.renderConfig.heightReduce;
		const isRenderRegionChange = renderConfigKeys.includes('renderRegion') && renderConfig.renderRegion !== this.renderConfig.renderRegion;
		const isAvoidOverlapChange = renderConfigKeys.includes('avoidOverlap') && renderConfig.avoidOverlap !== this.renderConfig.avoidOverlap;
		const isMinSpaceChange = renderConfigKeys.includes('minSpace') && renderConfig.minSpace !== this.renderConfig.minSpace;

		Object.assign(this.renderConfig, renderConfig);

		// 如果 init 为 false 的话，说明此时是外部触发的 setRenderConfig，需要根据设置的 render 属性进行额外的处理
		// 对布局有影响的属性：speed、heightReduce、renderRegion、avoidOverlap
		if (!init && (isSpeedChange || isHeightReduceChange || isRenderRegionChange || isAvoidOverlapChange)) {
			// 高度缩减需要重新处理 DOM
			if (isHeightReduceChange) this.handleDOM(this.container, this.canvas, this.ctx);
			this.barrageLayoutCalculate.renderConfigChange(
				isSpeedChange,
				isHeightReduceChange,
				isRenderRegionChange,
				isAvoidOverlapChange,
				isMinSpaceChange,
			);
		}
		// 触发一帧的渲染
		if (!this.animationHandle && !init) this._render();
	}

	/**
	 * 设置渲染配置（可以部分设置配置）
	 * @param renderConfig 渲染配置
	 */
	setRenderConfig(renderConfig: Partial<RenderConfig>) {
		this.setRenderConfigInternal(renderConfig);
	}

	/**
	 * 设置开发配置（可以部分设置配置）
	 * @param devConfig 开发配置
	 */
	setDevConfig(devConfig: Partial<DevConfig>) {
		if (!this.devConfig) this.devConfig = DEFAULT_DEV_CONFIG;
		Object.assign(this.devConfig, devConfig);
	}

	/**
	 * 负责每一帧的渲染
	 * @private
	 */
	private _render() {
		// 如果是弹幕关闭状态的话，直接 return
		if (!this.isOpen) return;

		// 获取需要渲染的弹幕
		let renderBarrages = this.barrageLayoutCalculate.getRenderBarrages(this.progress);

		// 对需要渲染的弹幕进行一层自定义过滤
		if (this.renderConfig.barrageFilter) {
			renderBarrages = renderBarrages.filter(barrage => this.renderConfig.barrageFilter!(barrage));
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.globalAlpha = this.renderConfig.opacity;

		// 遍历弹幕实例进行渲染
		renderBarrages.forEach(barrage => {
			barrage.render(this.offscreenCanvasCtx ?? this.ctx);
		});

		if (this.devConfig.isRenderFPS) this.renderFps();

		// 执行下一帧
		if (this.animationHandle) {
			requestAnimationFrame(() => this._render());
		}
	}

	/**
	 * 创建动画任务
	 * @private
	 */
	private _createAnimation() {
		if (!this.animationHandle && this.isOpen) {
			this.animationHandle = requestAnimationFrame(() => this._render());
		}
	}

	/**
	 * 当前动画的播放进度，单位：毫秒
	 */
	get progress() {
		return this.videoStatus.currentTime;
	}

	/**
	 * video 的状态
	 */
	get videoStatus() {
		return {
			// 当前视频的播放进度（ms）
			currentTime: this.video.currentTime * 1000,
			// 当前视频是不是播放中
			playing: !this.video.paused,
		}
	}

	/**
	 * canvas 的尺寸
	 */
	get canvasSize() {
		const dpr = Utils.Canvas.getDevicePixelRatio();
		return {
			width: this.canvas.width / dpr,
			height: this.canvas.height / dpr,
		};
	}

	/**
	 * 触发一帧的渲染
	 */
	renderFrame() {
		if (!this.animationHandle) this._render();
	}

	/**
	 * 执行弹幕的播放
	 */
	play() {
		// 执行动画
		this._createAnimation();
	}

	/**
	 * 暂停弹幕的播放
	 */
	pause() {
		this.animationHandle && cancelAnimationFrame(this.animationHandle);
		this.animationHandle = undefined;
	}

	/**
	 * 是否打开弹幕
	 * @param isOpen 是否打开弹幕
	 */
	switch(isOpen: boolean) {
		this.isOpen = isOpen;
		if (isOpen) {
			// 进行打开操作，根据当前是不是播放状态进行不同的处理
			this.videoStatus.playing ? this._createAnimation() : this._render();
		} else {
			// 进行关闭操作
			this.animationHandle && cancelAnimationFrame(this.animationHandle);
			this.animationHandle = undefined;
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	/**
	 * 渲染 FPS
	 */
	private renderFps() {
		const now = Date.now();
		// 如果上一帧存在，并且距离上次计算 fps 有 200ms 的话，则重新计算 fps
		if (this.lastFrameTime && now - this.lastCalcTime > 200) {
			this.fps = `${Math.floor(1000 / (now - this.lastFrameTime))}FPS`;
			this.lastCalcTime = now;
		}

		// 记录这一帧的时间
		this.lastFrameTime = now;

		if (this.fps) {
			this.ctx.font = 'bold 32px Microsoft YaHei';
			this.ctx.fillStyle = 'blue';
			this.ctx.fillText(this.fps, 20, 30);
		}
	}

	/**
	 * 判断弹幕数据是否合规
	 * @param barrage 弹幕配置对象
	 */
	private validateBarrageOption(barrage: BarrageOptions): true | BarrageOptionError {
		// 固定弹幕
		if (barrage.barrageType === 'top' || barrage.barrageType === 'bottom') {
			// 固定弹幕的持续时间小于等于 0 的话，过滤掉
			if (barrage.duration <= 0) {
				return new BarrageOptionError({
					code: ErrorCode.FIXED_DURATION_ERROR,
					message: 'The duration of the fixed barrage should be greater than 0',
				});
			}
		}

		// 高级弹幕
		if (barrage.barrageType === 'senior') {
			const {
				totalDuration,
				delay,
				motionDuration,
			} = barrage.seniorBarrageConfig;
			if (totalDuration <= 0) {
				return new BarrageOptionError({
					code: ErrorCode.SENIOR_TOTAL_ERROR,
					message: 'The totalDuration of senior barrage should be greater than 0',
				});
			}
			if (delay < 0) {
				return new BarrageOptionError({
					code: ErrorCode.SENIOR_DELAY_ERROR,
					message: 'The delay of senior barrage should be greater than or equal to 0',
				});
			}
			if (motionDuration < 0) {
				return new BarrageOptionError({
					code: ErrorCode.SENIOR_MOTION_ERROR,
					message: 'The motionDuration of senior barrage should be greater than or equal to 0',
				});
			}
		}

		// 如果合规的话，返回 true
		return true;
	}
}

/**
 * 弹幕渲染器 class 构造函数的参数
 */
export type RendererOptions = {
	// 容器 DOM
	container: string | HTMLElement;
	// video 元素（获取 video 元素，只是为了获取播放状态，不会对 video 执行其他操作）
	video: HTMLVideoElement;
	// 弹幕数据
	barrages?: BarrageOptions[];
	// 弹幕中渲染图片的配置
	barrageImages?: BarrageImage[];
	// 渲染相关配置
	renderConfig?: Partial<RenderConfig>;
	// 开发相关配置
	devConfig?: Partial<DevConfig>,
}

/**
 * 弹幕渲染器渲染弹幕的配置
 */
export type RenderConfig = {
	// 自定义弹幕过滤器，返回 false，弹幕就会被过滤掉
	barrageFilter?: (barrage: BaseBarrage) => boolean;

	// Canvas 元素默认和 container 等高，为了避免弹幕渲染遮挡住播放器的控制栏，可以设置减少一定的高度
	heightReduce: number;
	// 弹幕运行速度，仅对滚动弹幕有效（每秒多少像素）
	speed: number;
	// 显示区域，只针对滚动弹幕，有效值 0 ~ 1
	renderRegion: number;
	// 滚动弹幕水平最小间距
	minSpace: number;
	// 是否重叠，只适用于滚动弹幕
	avoidOverlap: boolean;

	// 透明度，有效值 0 ~ 1
	opacity: number;
	// 弹幕字体
	fontFamily: string;
	// 字体粗细
	fontWeight: string;
}

/**
 * 默认渲染配置
 */
const DEFAULT_RENDER_CONFIG: RenderConfig = {
	heightReduce: 0,
	speed: 200,
	opacity: 1,
	renderRegion: 1,
	fontFamily: 'Microsoft YaHei',
	fontWeight: 'normal',
	avoidOverlap: true,
	minSpace: 10,
}

/**
 * 弹幕中渲染图片的配置
 */
export type BarrageImage = {
	// 弹幕图片的唯一标识
	id: string;
	// 图片的地址
	url: string;
	// 渲染时的宽
	width: number;
	// 渲染时的高
	height: number;
}

/**
 * 开发相关配置
 */
export type DevConfig = {
	// 是否渲染 fps
	isRenderFPS: boolean;
	// 是否渲染弹幕边框
	isRenderBarrageBorder: boolean;
	// 是否打印关键数据
	isLogKeyData: boolean;
}

/**
 * 默认开发配置
 */
const DEFAULT_DEV_CONFIG: DevConfig = {
	isRenderFPS: false,
	isRenderBarrageBorder: false,
	isLogKeyData: false,
}

export {
	BarrageRenderer,
};

export * from './barrage';

export * from './errors';
