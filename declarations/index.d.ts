import type { DefineComponent, InjectionKey, PropType, Ref } from 'vue';
import type { EChartsOption, EChartsType } from 'echarts';

/* ================= 基准常量 / 主题 ================= */

/** 设计稿基准尺寸(像素), 默认 1920x1080 */
export declare const BOARD_DESIGN: {
  readonly width: 1920;
  readonly height: 1080;
};

/** 适配模式: scale=等比缩放(默认, 不变形, 留白兜底) / stretch=拉伸铺满(无黑边, 可接受轻微变形) */
export declare type BoardFitMode = 'scale' | 'stretch';

/** 大屏主题色板 */
export declare const BOARD_COLORS: {
  readonly primary: string;
  readonly success: string;
  readonly warning: string;
  readonly danger: string;
  readonly text: string;
  readonly textSub: string;
  readonly grid: string;
  readonly panelBg: string;
  readonly panelBorder: string;
  readonly bgDeep: string;
};

/** 注册全局 echarts 深色主题 'board-dark'(单例, 幂等) */
export declare function registerBoardChartTheme(): void;

/* ================= 缩放上下文 ================= */

export declare interface ScreenScaleContext {
  /** 当前等比缩放比 */
  scale: Ref<number>;
  /** 设计稿尺寸 */
  design: { width: number; height: number };
}

/** ScaleScreen 通过 provide 提供的注入键 */
export declare const ScreenScaleKey: InjectionKey<ScreenScaleContext>;

/* ================= 组件 ================= */

export declare interface ScaleScreenProps {
  /** 设计稿宽度, 默认 1920 */
  designWidth?: number;
  /** 设计稿高度, 默认 1080 */
  designHeight?: number;
  /** 适配模式: scale=等比(默认) / stretch=拉伸铺满 */
  mode?: BoardFitMode;
  /** 舞台背景: 渐变/纯色/图片 URL(等比模式下留白区域的兜底背景) */
  background?: string;
  /**
   * 背景填充方式:
   *  - static(默认): 背景原样平铺在舞台(适合渐变/纯色)
   *  - cover: 背景图以 cover 铺满整个视口, 超宽/超高屏时无缝延展裁切
   */
  backgroundMode?: 'static' | 'cover';
  /** 全屏模式: 铺满视口, 并接管 body 背景色(离开页面自动恢复) */
  fullScreen?: boolean;
}

/** 固定设计稿 + 等比 scale 投影的适配容器(大屏根组件) */
export declare const ScaleScreen: DefineComponent<ScaleScreenProps, {}, any>;

export declare interface ChartWidgetProps {
  /** echarts option(完整可渲染配置) */
  option: EChartsOption;
  /** 主题名, 默认使用框架注册的深色主题 'board-dark' */
  theme?: string;
  /** 监听容器尺寸自动 resize, 默认 true */
  autoResize?: boolean;
  /** setOption 时是否整体替换(notMerge), 默认 true */
  notMerge?: boolean;
  /** 渲染像素密度; 默认按屏幕等比缩放比自动提升, 放大时保持清晰 */
  pixelRatio?: number;
}

/** echarts 封装组件(自动 init / resize / dispose) */
export declare const ChartWidget: DefineComponent<
  ChartWidgetProps,
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  { getInstance: () => EChartsType | null }
>;

export declare interface BoardPanelProps {
  /** 面板标题 */
  title?: string;
  /** 内容区留白, 默认 '10px 12px' */
  padding?: string;
}

/** 发光面板容器(标题栏 + 内容区) */
export declare const BoardPanel: DefineComponent<BoardPanelProps, {}, any>;

/* ================= composables ================= */

export declare interface ScreenScaleState {
  /** 等比缩放比(scale 模式下 scaleX === scaleY === scale) */
  scale: number;
  scaleX: number;
  scaleY: number;
  /** 画布相对舞台的居中偏移 */
  offsetX: number;
  offsetY: number;
  mode: BoardFitMode;
}

/**
 * 屏幕适配核心
 * @param getContainer 返回舞台容器元素的函数(通常传 ref 的 .value)
 * @param design 设计稿尺寸, 默认 BOARD_DESIGN
 * @param mode 适配模式, 默认 'scale'
 * @returns 响应式缩放状态 + start/stop(组件卸载时请调用 stop)
 */
export declare function useScreenScale(
  getContainer: () => HTMLElement | null | undefined,
  design?: { width: number; height: number },
  mode?: BoardFitMode,
): {
  state: ScreenScaleState;
  start: () => void;
  stop: () => void;
};

export declare interface BoardPollingOptions {
  /** 轮询间隔(ms), 默认 5000 */
  interval?: number;
  /** 是否立即拉取一次, 默认 true */
  immediate?: boolean;
  /** 拉取失败回调 */
  onError?: (err: unknown) => void;
}

/**
 * 数据轮询(在 setup 中调用, 组件卸载自动停止)
 * @param fetcher 数据源: 支持同步返回或 Promise
 */
export declare function useBoardPolling<T>(
  fetcher: () => T | Promise<T>,
  options?: BoardPollingOptions,
): {
  data: Ref<T | undefined>;
  loading: Ref<boolean>;
  error: Ref<unknown>;
  refresh: () => Promise<void>;
  start: () => void;
  stop: () => void;
};

/* ================= 导出辅助 ================= */
export type { EChartsOption, EChartsType };
export type { PropType };
