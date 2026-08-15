/**
 * ============================================================
 * bigscreen-board · 基准常量
 * ------------------------------------------------------------
 * 业内主流约定: 设计稿以 1920x1080 (16:9) 为基准,
 * 由 ScaleScreen 组件负责把固定画布"等比投影"到任意分辨率的屏幕。
 * 本包只做屏幕适配, 不依赖 echarts / 字体等第三方资源。
 * ============================================================
 */

/** 设计稿基准尺寸(像素) */
export const BOARD_DESIGN = { width: 1920, height: 1080 } as const;

/** 适配模式: scale=等比缩放(默认, 不变形, 留白兜底) / stretch=拉伸铺满(无黑边, 可接受轻微变形) */
export type BoardFitMode = 'scale' | 'stretch';

/** 大屏主题色板(纯常量, 供业务自定义样式/图表时参考) */
export const BOARD_COLORS = {
  primary: '#00E5FF',
  success: '#00FFA3',
  warning: '#FFB020',
  danger: '#FF4D6D',
  text: '#E6F7FF',
  textSub: '#8FB3C7',
  grid: 'rgba(0, 229, 255, 0.12)',
  panelBg: 'rgba(6, 26, 58, 0.55)',
  panelBorder: 'rgba(0, 229, 255, 0.28)',
  bgDeep: '#050B1A',
} as const;
