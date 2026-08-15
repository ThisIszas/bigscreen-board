# @thisiszas/bigscreen-board

> 数据可视化大屏框架 —— 业内主流适配方案开箱即用。

固定 **1920×1080** 设计稿 + **等比 transform: scale() 投影**到任意分辨率屏幕：
**画面永不变形、留白自动兜底、背景可 cover 延展**。基于 Vue 3 + ECharts，
组件化、composable 化，几分钟搭出一块专业大屏。

## 特性

- 🖥️ **双适配模式**：<code>scale</code>（等比缩放、不变形、留白兜底）/ <code>stretch</code>（拉伸铺满、无黑边）
- 🖼️ **背景自适应**：<code>backgroundMode="cover"</code> 让背景图随屏幕比例无缝延展
- 📊 **图表零配置**：<code>ChartWidget</code> 自动 init / resize / dispose，内置深色主题
- 🔍 **放大不模糊**：按屏幕缩放比自动提升 canvas 渲染像素密度（devicePixelRatio）
- 🔄 **数据轮询开箱即用**：<code>useBoardPolling</code> 定时刷新 + 加载/错误态 + 卸载自动清理
- 🎨 **可定制主题**：色板与 echarts 主题均开放，<code>ysbth</code> 数字字体随包分发
- 📦 **ESM + CJS + 类型声明**：双格式产物，TypeScript 友好

## 安装

    npm install @thisiszas/bigscreen-board echarts echarts-liquidfill
    # 或
    pnpm add @thisiszas/bigscreen-board echarts echarts-liquidfill

> <code>vue@^3.3</code>、<code>echarts@^5.4</code>、<code>echarts-liquidfill@^3.1</code> 为
> peerDependencies，需宿主项目自行安装。

## 快速开始

    <template>
      <!-- 根容器: 1920x1080 设计稿, 等比投影到任意屏幕 -->
      <ScaleScreen mode="scale" full-screen>
        <div class="page">
          <BoardPanel title="今日产量">
            <div class="num">{{ data ?? '--' }}</div>
          </BoardPanel>

          <BoardPanel title="产量趋势">
            <ChartWidget :option="trendOption" />
          </BoardPanel>
        </div>
      </ScaleScreen>
    </template>

    <script lang="ts" setup>
    import { computed } from 'vue';
    import { ScaleScreen, BoardPanel, ChartWidget, useBoardPolling } from '@thisiszas/bigscreen-board';
    import '@thisiszas/bigscreen-board/style.css'; // 组件样式 + 数字字体(必须引入一次)
    import type { EChartsOption } from 'echarts';

    // 1. 数据轮询: 每 5s 拉取一次, 组件卸载自动停止
    const { data } = useBoardPolling(async () => {
      const res = await fetch('/api/production/today');
      return (await res.json()).output;
    }, { interval: 5000 });

    // 2. 图表: option 变化自动 setOption, 容器尺寸变化自动 resize
    const trendOption = computed<EChartsOption>(() => ({
      xAxis: { type: 'category', data: ['08:00', '10:00', '12:00', '14:00', '16:00'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', smooth: true, data: [120, 200, 150, 280, 310] }],
    }));
    </script>

    <style scoped>
    .page { height: 100%; display: flex; gap: 16px; padding: 24px; box-sizing: border-box; }
    .num { font-family: 'board-number'; font-size: 64px; color: #e6f7ff; }
    </style>

样式文件必须引入一次（<code>import '@thisiszas/bigscreen-board/style.css'</code>）：其中包含面板/适配容器
样式、<code>board-number</code> 数字字体（<code>ysbth.ttf</code> 已内联，随包自包含）。

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

子组件（含 ChartWidget）可通过 <code>inject(ScreenScaleKey)</code> 拿到当前缩放比与设计稿尺寸。

**不同屏幕比例下的表现**

| 场景 | mode | 表现 |
| --- | --- | --- |
| 16:9 屏 | scale | 画布 1:1 铺满, 无留白 |
| 21:9 超宽屏 | scale + backgroundMode="cover" | 内容等比居中, 背景向左右延展, 浑然一体 |
| 任意比例 | stretch | 画面铺满整个屏幕(可接受轻微拉伸变形) |

### ChartWidget —— 图表封装

基于 ECharts 的通用图表组件，统一深色主题与生命周期管理。

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| option | EChartsOption | - | 完整 echarts 配置(变化时自动 setOption) |
| theme | string | 'board-dark' | echarts 主题名, 框架已注册 board-dark |
| autoResize | boolean | true | 监听容器尺寸自动 resize |
| notMerge | boolean | true | setOption 时整体替换 |
| pixelRatio | number | 自动 | 渲染像素密度; 默认按屏幕缩放比提升, 放大时保持清晰 |

- 通过 <code>ref</code> 调用 <code>getInstance()</code> 获取 echarts 实例做高级操作。
- 液态球等扩展系列: <code>import 'echarts-liquidfill'</code> 后系列类型可直接使用。

### BoardPanel —— 面板容器

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| title | string | '' | 面板标题(发光竖条 + 文字) |
| padding | string | '10px 12px' | 内容区留白 |

支持 <code>#extra</code> 插槽在标题栏右侧放附加信息(如"实时"状态点)。

### useScreenScale —— 适配核心(composable)

    const { state, start, stop } = useScreenScale(
      () => containerRef.value,          // 舞台容器 getter
      { width: 1920, height: 1080 },     // 设计稿(可选, 默认 BOARD_DESIGN)
      'scale',                           // 模式(可选)
    );

<code>state</code> 为响应式: <code>{ scale, scaleX, scaleY, offsetX, offsetY, mode }</code>。
<code>ScaleScreen</code> 内部即基于它实现; 需要脱离组件自行适配(如 canvas / three.js 场景)
时可直接使用。

### useBoardPolling —— 数据轮询(composable)

    const { data, loading, error, refresh, start, stop } = useBoardPolling(
      async () => (await fetch('/api/data')).json(), // 同步返回或 Promise 均可
      { interval: 5000, immediate: true, onError: (e) => console.warn(e) },
    );

- 在 setup 中调用, 组件卸载自动 stop(基于 effect scope);
- <code>immediate: false</code> 时不自动开始, 需手动 <code>start()</code>;
- <code>data</code> 泛型推导自 fetcher 返回值。

### 主题与常量

| 导出 | 说明 |
| --- | --- |
| registerBoardChartTheme() | 注册 echarts 深色主题 board-dark(单例、幂等, ChartWidget 自动调用) |
| BOARD_DESIGN | { width: 1920, height: 1080 } 设计稿基准 |
| BOARD_COLORS | 色板: primary/success/warning/danger/text/textSub/grid/... |
| ScreenScaleKey | 缩放上下文注入键(配合 inject 使用) |

**自定义 echarts 主题**: 业务侧自行 <code>echarts.registerTheme('my-theme', {...})</code> 后给
ChartWidget 传 <code>theme="my-theme"</code> 即可, 无需修改框架。

## 适配原理

    ┌────────────────── 舞台(任意分辨率视口) ──────────────────┐
    │  背景 background(留白兜底 / cover 延展)                    │
    │  ┌──────────── 设计稿画布 1920x1080 ────────────┐         │
    │  │  transform: scale(min(vw/1920, vh/1080))    │         │
    │  │  left/top 居中                                │         │
    │  │  所有内容按设计稿像素布局(px 直写)              │         │
    │  └──────────────────────────────────────────────┘         │
    └──────────────────────────────────────────────────────────────┘

- 等比模式取 <code>scale = min(winW/1920, winH/1080)</code>, **画面永不变形**, 多余区域由背景兜底;
- <code>stretch</code> 模式宽高独立缩放, **任意屏幕无黑边**(可接受轻微变形);
- 画布内部按设计稿像素写布局, 无需 vw/rem 换算; 图表按设计稿尺寸渲染, 屏幕放大时
  ChartWidget 自动提升 devicePixelRatio 保持清晰。

## 数据接入(真实接口)

把轮询 fetcher 换成你的请求即可, 组件层零改动:

    const { data } = useBoardPolling(async () => {
      const res = await request.post('/deviceManageMs/device/getDeviceAndNamePlate', { faultStatus: true });
      return res.data.records; // 结构随业务定义
    }, { interval: 30000 });

## 目录结构

    packages/bigscreen-board/
    ├── src/
    │   ├── index.ts                  # 统一出口
    │   ├── components/
    │   │   ├── ScaleScreen.vue       # 适配根容器
    │   │   ├── ChartWidget.vue       # echarts 封装
    │   │   └── BoardPanel.vue        # 面板容器
    │   ├── composables/
    │   │   ├── useScreenScale.ts     # 适配核心
    │   │   └── useBoardPolling.ts    # 数据轮询
    │   ├── theme/
    │   │   ├── boardTheme.ts         # 基准常量 + echarts 深色主题
    │   │   └── screenScaleContext.ts # provide/inject 上下文
    │   └── assets/font/ysbth.ttf     # 数字字体
    ├── example/                      # 最小示例(可直接用 vite 起)
    ├── declarations/index.d.ts       # 手写类型声明(构建后拷贝至 dist)
    └── dist/                         # 构建产物: index.js / index.cjs / style.css / index.d.ts

## 开发 / 构建 / 发布

    # 本地运行示例(项目根起 dev server 后访问 example/index.html)
    npm run dev

    # 构建 lib(es + cjs + css + 类型声明)
    npm run build

    # 发布(自动执行构建)
    npm publish

### 一条龙发布脚本 release.sh

包内自带 release.sh, 一条龙完成: 构建 → 版本递增 → 打 git tag → 发布 → 验证。

    # 发官方源, 版本 +0.0.1
    ./release.sh patch

    # 发 beta tag(验证后再转 latest)
    ./release.sh minor --tag beta

    # 发公司私有源, 私有包
    ./release.sh patch --registry https://npm.your-company.com/ --access restricted

选项: --registry <url> / --access <mode> / --tag <name> / --no-build / --force(跳过 git 检查)。
发布前请确保已 npm login 到对应源。

## 常见问题

**1. 为什么必须引入 style.css?**
组件样式与 board-number 字体都在其中; 只引 JS 会丢失面板/适配样式和数字字体。

**2. 屏幕放大后文字模糊怎么办?**
ChartWidget 默认按缩放比自动提升像素密度, 无需处理。若图表仍模糊, 可显式传 pixelRatio 调高。

**3. 在非 Vue 环境(原生 canvas / three.js)怎么适配?**
直接用 useScreenScale 拿缩放状态, 自行把 scale/offset 应用到你的画布。

**4. 容器不是全屏(内嵌 iframe / 局部区域)?**
ScaleScreen 舞台默认 position: fixed 铺满视口; fullScreen=false 时改为撑满父容器。

**5. 发布到私有 registry?**
直接用 release.sh 指定源: <code>./release.sh patch --registry https://npm.your-company.com/ --access restricted</code>,
或把环境变量 <code>NPM_REGISTRY</code> 指向公司源。包已内置 <code>publishConfig.access</code>,
发公共源默认 public。

## License

MIT