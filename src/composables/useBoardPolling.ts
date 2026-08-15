/**
 * ============================================================
 * 大屏框架 · 数据轮询 (composable)
 * ------------------------------------------------------------
 * 大屏数据流标配: 定时拉取 + 加载态 + 错误处理 + 自动清理。
 * 在 setup 中调用, 组件卸载时自动停止(基于 effect scope)。
 * ============================================================
 */
import { onScopeDispose, ref } from 'vue';

export interface BoardPollingOptions {
  /** 轮询间隔(ms), 默认 5000 */
  interval?: number;
  /** 是否立即拉取一次, 默认 true */
  immediate?: boolean;
  /** 拉取失败回调 */
  onError?: (err: unknown) => void;
}

export function useBoardPolling<T>(
  /** 数据源: 支持同步返回或 Promise */
  fetcher: () => T | Promise<T>,
  options: BoardPollingOptions = {},
) {
  const { interval = 5000, immediate = true, onError } = options;

  const data = ref<T>();
  const loading = ref(false);
  const error = ref<unknown>(null);

  let timer: ReturnType<typeof setInterval> | null = null;

  async function refresh() {
    loading.value = true;
    try {
      data.value = await fetcher();
      error.value = null;
    } catch (e) {
      error.value = e;
      onError?.(e);
    } finally {
      loading.value = false;
    }
  }

  function start() {
    stop();
    void refresh();
    timer = setInterval(() => void refresh(), interval);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  onScopeDispose(stop);

  if (immediate) start();

  return { data, loading, error, refresh, start, stop };
}
