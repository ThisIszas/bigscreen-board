# @thisiszas/bigscreen-board

[![npm version](https://img.shields.io/npm/v/@thisiszas/bigscreen-board)](https://www.npmjs.com/package/@thisiszas/bigscreen-board)
[![npm downloads](https://img.shields.io/npm/dm/@thisiszas/bigscreen-board)](https://www.npmjs.com/package/@thisiszas/bigscreen-board)
[![license](https://img.shields.io/npm/l/@thisiszas/bigscreen-board)](https://www.npmjs.com/package/@thisiszas/bigscreen-board)

数据大屏屏幕适配库：把固定设计稿等比投影到任意分辨率屏幕，支持等比（scale）/ 拉伸（stretch）双适配模式、背景 cover 自适应延展。仅 peer 依赖 vue，不捆绑 echarts / 字体。

## 安装

    npm install @thisiszas/bigscreen-board

peerDependencies：<code>vue@^3.3</code>（宿主项目自行安装）。

## 快速开始

    <template>
      <!-- 根容器: 1920x1080 设计稿, 等比投影到任意屏幕 -->
      <ScaleScreen mode="scale" full-screen>
        <div class="page">
          <BoardPanel title="今日产量">
            <div class="num">{{ output }}</div>
          </BoardPanel>
        </div>
      </ScaleScreen>
    </template>

    <script lang="ts" setup>
    import { ScaleScreen, BoardPanel, useBoardPolling } from '@thisiszas/bigscreen-board';
    import '@thisiszas/bigscreen-board/style.css'; // 必须引入一次

    const { data } = useBoardPolling(async () => {
      const res = await fetch('/api/production/today');
      return (await res.json()).output;
    }, { interval: 5000 });
    const output = data;
    </script>

    <style scoped>
    .page { height: 100%; display: flex; padding: 24px; box-sizing: border-box; }
    .num { font-size: 64px; color: #e6f7ff; }
    </style>

## API

### ScaleScreen —— 适配根容器

固定设计稿尺寸的画布，通过 <code>transform: scale()</code> 等比/拉伸投影到外层舞台，resize 自动重算。

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| designWidth | number | 1920 | 设计稿宽度 |
| designHeight | number | 1080 | 设计稿高度 |
| mode | 'scale' / 'stretch' | 'scale' | scale=等比不变形、留白兜底；stretch=拉伸铺满无黑边 |
| background | string | 径向深色渐变 | 舞台背景(留白区域兜底), 支持渐变/纯色/图片 URL |
| backgroundMode | 'static' / 'cover' | 'static' | cover=背景图铺满视口, 超宽/超高屏无缝延展 |
| fullScreen | boolean | true | 铺满视口并接管 body 深色背景, 离开页面自动恢复 |

### BoardPanel —— 面板容器(纯样式)

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| title | string | '' | 面板标题 |
| padding | string | '10px 12px' | 内容区留白 |

支持 <code>#extra</code> 插槽。

### useScreenScale —— 适配核心(composable)

    const { state, start, stop } = useScreenScale(
      () => containerRef.value,          // 舞台容器 getter
      { width: 1920, height: 1080 },     // 设计稿(可选, 默认 BOARD_DESIGN)
      'scale',                           // 模式(可选)
    );

<code>state</code> 为响应式: <code>{ scale, scaleX, scaleY, offsetX, offsetY, mode }</code>。

### useBoardPolling —— 数据轮询(composable, 可选)

    const { data, loading, error, refresh, start, stop } = useBoardPolling(
      async () => (await fetch('/api/data')).json(),
      { interval: 5000, immediate: true, onError: (e) => console.warn(e) },
    );

在 setup 中调用，组件卸载自动停止。

### 常量与上下文

| 导出 | 说明 |
| --- | --- |
| BOARD_DESIGN | { width: 1920, height: 1080 } 设计稿基准 |
| BOARD_COLORS | 色板常量(供业务自定义样式/图表配色参考) |
| ScreenScaleKey | 缩放上下文注入键(配合 inject 使用) |

## 注意事项

1. 必须引入样式文件 <code>import '@thisiszas/bigscreen-board/style.css'</code>，否则适配容器与全屏 body 背景样式缺失。
2. 本包不提供字体与图表（echarts）。图表由业务侧自备：在 <code>ScaleScreen</code> 画布内自行 init，画布会被整体等比缩放。
3. 图表屏幕放大模糊时，用 <code>useScreenScale</code> 返回的 <code>state.scale</code> 提升 canvas 像素密度(devicePixelRatio)。
4. 容器不是全屏(内嵌 iframe / 局部区域)时，设 <code>fullScreen="false"</code> 改为撑满父容器。
5. 设计稿不是 1920x1080 时，传 <code>designWidth</code> / <code>designHeight</code> 即可，任意尺寸可用。

## License

MIT
