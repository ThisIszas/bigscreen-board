<template>
  <ScaleScreen mode="scale" full-screen>
    <div class="page">
      <BoardPanel title="示例: 轮询数据(2s)" class="card">
        <div class="num">{{ data ?? '--' }}</div>
        <div class="tip">由 useBoardPolling 每 2 秒刷新</div>
      </BoardPanel>
      <BoardPanel title="示例: 图表" class="card">
        <ChartWidget :option="option" />
      </BoardPanel>
    </div>
  </ScaleScreen>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { ScaleScreen, BoardPanel, ChartWidget, useBoardPolling } from '../dist/index.js';
import type { EChartsOption } from 'echarts';
import { genData } from './mock';

const { data } = useBoardPolling(genData, { interval: 2000 });

const option = computed<EChartsOption>(() => {
  const v = data.value ?? 50;
  return {
    series: [
      {
        type: 'pie',
        radius: ['46%', '70%'],
        label: { show: false },
        data: [
          { value: v, name: '完成', itemStyle: { color: '#00E5FF', shadowColor: '#00E5FF', shadowBlur: 12 } },
          { value: 100 - v, name: '剩余', itemStyle: { color: 'rgba(0, 60, 120, 0.4)' } },
        ],
      },
    ],
  };
});
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
}
#app {
  height: 100%;
}
.page {
  height: 100%;
  display: flex;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box;
}
.card {
  flex: 1;
}
.num {
  font-family: 'board-number';
  font-size: 64px;
  color: #e6f7ff;
}
.tip {
  margin-top: 8px;
  font-size: 13px;
  color: #8fb3c7;
}
</style>
