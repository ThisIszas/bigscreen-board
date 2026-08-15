/**
 * ============================================================
 * 大屏框架 · 屏幕适配核心 (composable)
 * ------------------------------------------------------------
 * 业内主流方案: 固定设计稿尺寸 + transform: scale() 等比投影。
 *  - scale   模式: 等比缩放(取 min), 画面永不变形, 剩余区域由背景兜底
 *  - stretch 模式: 宽高独立缩放铺满, 任意屏幕无黑边(可接受轻微变形)
 * 通过 ResizeObserver + window.resize(rAF 节流) 自动重算。
 * ============================================================
 */
import { reactive } from 'vue';
import type { BoardFitMode } from '../theme/boardTheme';
import { BOARD_DESIGN } from '../theme/boardTheme';

export interface ScreenScaleState {
  /** 等比缩放比(scale 模式下 scaleX === scaleY === scale) */
  scale: number;
  scaleX: number;
  scaleY: number;
  /** 画布相对舞台的居中偏移 */
  offsetX: number;
  offsetY: number;
  mode: BoardFitMode;
}

export function useScreenScale(
  getContainer: () => HTMLElement | null | undefined,
  design: { width: number; height: number } = BOARD_DESIGN,
  mode: BoardFitMode = 'scale',
) {
  const state = reactive<ScreenScaleState>({
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    offsetX: 0,
    offsetY: 0,
    mode,
  });

  let rafId = 0;
  let resizeObserver: ResizeObserver | null = null;

  function compute() {
    const el = getContainer();
    const cw = el?.clientWidth || window.innerWidth;
    const ch = el?.clientHeight || window.innerHeight;
    if (!cw || !ch) return;

    const sx = cw / design.width;
    const sy = ch / design.height;
    const s = Math.min(sx, sy);

    if (mode === 'stretch') {
      state.scale = s;
      state.scaleX = sx;
      state.scaleY = sy;
      state.offsetX = 0;
      state.offsetY = 0;
    } else {
      state.scale = s;
      state.scaleX = s;
      state.scaleY = s;
      state.offsetX = (cw - design.width * s) / 2;
      state.offsetY = (ch - design.height * s) / 2;
    }
  }

  function schedule() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(compute);
  }

  function start() {
    compute();
    window.addEventListener('resize', schedule);
    const el = getContainer();
    if (el && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(schedule);
      resizeObserver.observe(el);
    }
  }

  function stop() {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', schedule);
    resizeObserver?.disconnect();
    resizeObserver = null;
  }

  return { state, start, stop };
}
