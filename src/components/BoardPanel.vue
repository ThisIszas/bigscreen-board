<template>
  <section class="board-panel">
    <header v-if="title || $slots.extra" class="board-panel-header">
      <span class="board-panel-title">
        <i class="bar" />
        {{ title }}
      </span>
      <span class="board-panel-extra">
        <slot name="extra" />
      </span>
    </header>
    <div class="board-panel-body" :style="{ padding }">
      <slot />
    </div>
  </section>
</template>

<script lang="ts" setup>
export interface BoardPanelProps {
  title?: string;
  /** 内容区留白 */
  padding?: string;
}

withDefaults(defineProps<BoardPanelProps>(), {
  title: '',
  padding: '10px 12px',
});
</script>

<style scoped lang="scss">
.board-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-radius: 6px;
  border: 1px solid rgba(0, 229, 255, 0.28);
  background: linear-gradient(165deg, rgba(10, 34, 78, 0.72) 0%, rgba(4, 14, 36, 0.6) 100%);
  box-shadow: inset 0 0 24px rgba(0, 120, 255, 0.1), 0 0 18px rgba(0, 150, 255, 0.12);
  backdrop-filter: blur(4px);
  overflow: hidden;

  .board-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: none;
    height: 42px;
    padding: 0 14px;

    .board-panel-title {
      display: inline-flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #e6f7ff;
      text-shadow: 0 0 12px rgba(0, 229, 255, 0.5);

      .bar {
        width: 4px;
        height: 14px;
        margin-right: 8px;
        border-radius: 2px;
        background: linear-gradient(180deg, #00e5ff, #0077ff);
        box-shadow: 0 0 8px rgba(0, 229, 255, 0.8);
      }
    }

    .board-panel-extra {
      font-size: 12px;
      color: #8fb3c7;
    }
  }

  .board-panel-body {
    flex: 1;
    min-height: 0;
  }
}
</style>
