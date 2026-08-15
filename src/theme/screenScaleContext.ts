/**
 * 大屏框架 · 缩放上下文
 * 由 ScaleScreen 通过 provide 提供, 子组件(如图表)可注入读取当前等比缩放比,
 * 用于提升 canvas 渲染清晰度等场景。
 */
import type { InjectionKey, Ref } from 'vue';

export interface ScreenScaleContext {
  /** 当前等比缩放比 */
  scale: Ref<number>;
  /** 设计稿尺寸 */
  design: { width: number; height: number };
}

export const ScreenScaleKey: InjectionKey<ScreenScaleContext> = Symbol('board-screen-scale');
