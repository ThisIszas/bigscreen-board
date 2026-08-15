# @thisiszas/bigscreen-board

> 数据大屏**屏幕适配库** —— 只做一件事：把固定设计稿等比投影到任意分辨率屏幕。

固定 **1920×1080** 设计稿 + **等比 transform: scale()** 投影：
**画面永不变形、留白自动兜底、背景可 cover 延展**。
**零外部依赖**（仅 peer 依赖 vue），不捆绑 echarts、不携带字体，轻量即插即用。

## 特性

- 🖥️ **双适配模式**：<code>scale</code>（等比缩放、不变形、留白兜底）/ <code>stretch</code>（拉伸铺满、无黑边）
- 🖼️ **背景自适应**：<code>backgroundMode="cover"</code> 让背景图随屏幕比例无缝延展
- 📦 **零依赖**：不捆绑 echarts / 字体 / UI 库，图表与视觉完全交给业务侧
- 🔍 **适配核心可复用**：<code>useScreenScale</code> 可在 canvas / three.js 等非 Vue 场景直接使用
- 🔄 <code>useBoardPolling</code> 数据轮询（纯 Vue，可选）
- 📐 ESM + CJS + 类型声明，TypeScript 友好

## 安装

    npm install @thisiszas/bigscreen-board
    # 或
    pnpm add @thisiszas/bigscreen-board

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
    import { ref } from 'vue';
    import { ScaleScreen, BoardPanel, useBoardPolling } from '@thisiszas/bigscreen-board';
    import '@thisiszas/bigscreen-board/style.css'; // 适配容器样式(必须引入一次)

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

样式文件必须引入一次（<code>import '@thisiszas/bigscreen-board/style.css'</code>）：含适配容器
（舞台/画布）样式与全屏 body 背景接管，**不含任何字体或图表样式**。

## 图表怎么办？（业务侧自选）

本包**不提供图表**。ECharts 等图表库由业务侧直接使用，与本包互不干扰：

- 图表组件内 <code>import * as echarts from 'echarts'</code>，自行 init / resize；
- 把图表放进 <code>ScaleScreen</code> 的 1920×1080 画布内即可，画布被整体等比缩放，图表按设计稿像素渲染；
- 屏幕放大导致模糊时，可参考 <code>useScreenScale</code> 返回的 <code>state.scale</code> 提升 canvas 像素密度。

## API 文档

### ScaleScreen —— 适配根容器

固定设计稿尺寸的画布，通过 <code>transform: scale()</code> 等比/拉伸投影到外层舞台，
<code>resize</code> 自动重算（ResizeObserver + window.resize，rAF 节流）。

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| designWidth | number | 1920 | 设计稿宽度 |
| designHeight | number | 1080 | 设计稿高度 |
| mode | 'scale' / 'stretch' | 'scale' | scale=等比不变形、留白兜底；stretch=拉伸铺满无黑边 |
| background | string | 径向深色渐变 | 舞台背景(留白区域兜底), 支持渐变/纯色/图片 URL |
| backgroundMode | 'static' / 'cover' | 'static' | cover=背景图铺满视口, 超宽/超高屏无缝延展 |
| fullScreen | boolean | true | 铺满视口并接管 body 深色背景, 离开页面自动恢复 |

子组件可通过 <code>inject(ScreenScaleKey)</code> 拿到当前缩放比与设计稿尺寸。

### BoardPanel —— 面板容器(纯样式)

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| title | string | '' | 面板标题(发光竖条 + 文字) |
| padding | string | '10px 12px' | 内容区留白 |

支持 <code>#extra</code> 插槽。

### useScreenScale —— 适配核心(composable)

    const { state, start, stop } = useScreenScale(
      () => containerRef.value,          // 舞台容器 getter
      { width: 1920, height: 1080 },     // 设计稿(可选, 默认 BOARD_DESIGN)
      'scale',                           // 模式(可选)
    );

<code>state</code> 为响应式: <code>{ scale, scaleX, scaleY, offsetX, offsetY, mode }</code>。
<code>ScaleScreen</code> 内部即基于它实现；canvas / three.js 等场景可直接使用。

### useBoardPolling —— 数据轮询(composable, 可选)

    const { data, loading, error, refresh, start, stop } = useBoardPolling(
      async () => (await fetch('/api/data')).json(),
      { interval: 5000, immediate: true, onError: (e) => console.warn(e) },
    );

在 setup 中调用，组件卸载自动停止；<code>data</code> 泛型推导自 fetcher 返回值。

### 常量与上下文

| 导出 | 说明 |
| --- | --- |
| BOARD_DESIGN | { width: 1920, height: 1080 } 设计稿基准 |
| BOARD_COLORS | 色板常量(供业务自定义样式/图表配色参考) |
| ScreenScaleKey | 缩放上下文注入键(配合 inject 使用) |

## 适配原理

    ┌────────────────── 舞台(任意分辨率视口) ──────────────────┐
    │  背景 background(留白兜底 / cover 延展)                    │
    │  ┌──────────── 设计稿画布 1920x1080 ────────────┐         │
    │  │  transform: scale(min(vw/1920, vh/1080))    │         │
    │  │  left/top 居中                                │         │
    │  │  所有内容按设计稿像素布局(px 直写)              │         │
    │  └──────────────────────────────────────────────┘         │
    └──────────────────────────────────────────────────────────────┘

- 等比模式取 <code>scale = min(winW/1920, winH/1080)</code>, 画面永不变形, 多余区域由背景兜底;
- <code>stretch</code> 模式宽高独立缩放, 任意屏幕无黑边(可接受轻微变形);
- 设计稿尺寸完全可配(<code>designWidth/designHeight</code>), 3840x2160、21:9 等任意比例均可。

## 开发 / 构建 / 发布

    # 本地运行示例
    npm run dev

    # 构建 lib(es + cjs + css + 类型声明)
    npm run build

    # 一条龙发布(构建 → 版本 → git tag → 发布 → 验证)
    ./release.sh patch                # 2FA 账号: 按提示输一次性密码
    ./release.sh patch --otp 123456   # 或直接带码
    NPM_TOKEN=xxx ./release.sh patch  # 或使用 bypass 2FA token(临时认证, 用后即弃)

选项: --registry <url> / --access <mode> / --tag <name> / --otp <code> / --no-build / --dry-run / --force。

## 常见问题

**1. 为什么没有字体和 echarts？**
本包定位为纯屏幕适配, 字体/图表由业务侧按需引入, 避免包体积膨胀与版本耦合。

**2. 图表屏幕放大模糊怎么办？**
用 useScreenScale 的 state.scale 提升 canvas 像素密度(devicePixelRatio)即可。

**3. 非全屏容器(iframe/局部区域)？**
ScaleScreen 舞台默认 position: fixed 铺满视口; fullScreen=false 时改为撑满父容器。

**4. 设计稿不是 1920x1080？**
传 designWidth/designHeight 即可, 任意尺寸可用。

## License

MIT
