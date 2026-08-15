/**
 * ============================================================
 * 大屏框架 · 基准常量与 echarts 深色主题
 * ------------------------------------------------------------
 * 业内主流约定: 设计稿以 1920x1080 (16:9) 为基准,
 * 由 ScaleScreen 组件负责把固定画布"等比投影"到任意分辨率的屏幕。
 * ============================================================
 */
import * as echarts from 'echarts';

/** 设计稿基准尺寸(像素) */
export const BOARD_DESIGN = { width: 1920, height: 1080 } as const;

/** 适配模式: scale=等比缩放(默认, 不变形, 留白兜底) / stretch=拉伸铺满(无黑边, 可接受轻微变形) */
export type BoardFitMode = 'scale' | 'stretch';

/** 大屏主题色板(深色科技风) */
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

let themeRegistered = false;

/** 注册全局深色主题(单例), 供所有 ChartWidget 使用 */
export function registerBoardChartTheme() {
  if (themeRegistered) return;
  themeRegistered = true;
  echarts.registerTheme('board-dark', {
    color: [
      BOARD_COLORS.primary,
      BOARD_COLORS.success,
      BOARD_COLORS.warning,
      BOARD_COLORS.danger,
      '#7C6BFF',
      '#FF8FB1',
    ],
    backgroundColor: 'transparent',
    textStyle: {
      color: BOARD_COLORS.text,
      fontFamily: 'PingFang SC, Microsoft YaHei, sans-serif',
    },
    title: { textStyle: { color: BOARD_COLORS.text, fontSize: 16 } },
    legend: {
      textStyle: { color: BOARD_COLORS.textSub },
      pageTextStyle: { color: BOARD_COLORS.textSub },
    },
    tooltip: {
      backgroundColor: 'rgba(4, 16, 42, 0.92)',
      borderColor: BOARD_COLORS.panelBorder,
      borderWidth: 1,
      textStyle: { color: BOARD_COLORS.text, fontSize: 13 },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: BOARD_COLORS.grid } },
      axisTick: { show: false },
      axisLabel: { color: BOARD_COLORS.textSub, fontSize: 12 },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: BOARD_COLORS.textSub, fontSize: 12 },
      splitLine: { lineStyle: { color: BOARD_COLORS.grid, type: 'dashed' } },
    },
  });
}
