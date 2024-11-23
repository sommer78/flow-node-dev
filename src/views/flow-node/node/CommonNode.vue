<script setup lang="ts">
import { Position, useNode } from "@vue-flow/core";
import type { FlowNode } from "../../../../types/flow";
import { useThemeStore } from "@/store/modules/theme";
import { computed, ref, onMounted } from "vue";

// defineProps<{
//   id: string;
//   label: string;
//   data: FlowNode["data"];
// }>();
const { node } = useNode();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");
</script>

<template>
  <div
    class="custom-node transition-colors duration-300"
    :class="[
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      { 'ring-2 ring-blue-500': node.selected }
    ]"
  >
    <!-- Node Header -->
    <div class="node-header" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
      <div class="node-title">{{ node.label }}</div>
      <div class="node-type">{{ node.data.contentType }}</div>
    </div>

    <!-- Node Content -->
    <div class="node-content">
      <div v-if="node.data.content" class="content-preview">
        <template v-if="node.data.contentType === 'code'">
          <div class="code-badge">{{ node.data.codeLanguage }}</div>
        </template>
        <template
          v-else-if="['circuit', 'pcb'].includes(node.data.contentType)"
        >
          <div class="file-badge">{{ node.data.fileType }}</div>
        </template>
      </div>
      <div v-else class="empty-content">No content</div>
    </div>

    <!-- Input Handlers -->
    <template v-if="node.data.inputs">
      <div
        v-for="input in node.data.inputs"
        :key="input.id"
        :class="['input-handle', `position-${input.position}`]"
        data-handleid="target"
        :data-handlepos="input.position"
      >
        {{ input.label }}
      </div>
    </template>

    <!-- Output Handlers -->
    <template v-if="node.data.outputs">
      <div
        v-for="output in node.data.outputs"
        :key="output.id"
        :class="['output-handle', `position-${output.position}`]"
        data-handleid="source"
        :data-handlepos="output.position"
      >
        {{ output.label }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.custom-node {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0;
  min-width: 180px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  @apply rounded-lg border min-w-[150px] shadow-lg relative;

  .node-header {
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    border-radius: 8px 8px 0 0;
    background: #f8f9fa;

    .node-title {
      font-weight: 600;
      font-size: 14px;
    }

    .node-type {
      font-size: 12px;
      color: #666;
    }
  }

  .node-content {
    padding: 12px;
    min-height: 60px;

    .content-preview {
      font-size: 12px;

      .code-badge,
      .file-badge {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 4px;
        background: #e9ecef;
        color: #495057;
      }
    }

    .empty-content {
      color: #adb5bd;
      font-size: 12px;
      text-align: center;
    }
  }

  .input-handle,
  .output-handle {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #6c757d;
    border: 2px solid white;
    border-radius: 50%;
    cursor: crosshair;
    font-size: 10px;
    color: white;
    display: flex;
    align-items: center;

    &.position-left {
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
    }

    &.position-right {
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
    }

    &.position-top {
      top: -6px;
      left: 50%;
      transform: translateX(-50%);
    }

    &.position-bottom {
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .input-handle {
    background: #20c997;
  }

  .output-handle {
    background: #fd7e14;
  }
}
</style>
