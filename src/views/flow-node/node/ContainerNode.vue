<script setup lang="ts">
import { Position, Handle, useNode } from "@vue-flow/core";
import { useThemeStore } from "@/store/modules/theme";
import { computed } from "vue";
import { useFlowStore } from "@/store/modules/flow";
import { ElSwitch } from "element-plus";
import "element-plus/theme-chalk/el-switch.css";

// const props = defineProps<{
//   id: string
//   data: {
//     inputs?: string[]
//     outputs?: string[]
//     children?: string[]
//     status?: boolean
//   }
//   label?: string
//   selected?: boolean
// }>()
const { node } = useNode();
const flowStore = useFlowStore();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");

// const onDragOver = (e: DragEvent) => {
//   e.preventDefault();
//   if (e.dataTransfer) {
//     e.dataTransfer.dropEffect = "move";
//   }
//   console.log(e);
// };

// const onDrop = (e: DragEvent) => {
//   e.preventDefault();
//   e.stopPropagation();
//   const node = e.target as HTMLElement;
//   console.log(e);
//   const type = e.dataTransfer?.getData("application/flownode");
//   if (type && node.id) {
//     const containerBounds = node?.getBoundingClientRect();
//     if (!containerBounds) return;

//     const position = {
//       x: e.clientX - containerBounds.left,
//       y: e.clientY - containerBounds.top
//     };

//     const newNode = {
//       id: `node-${node.id}-${type}-${Date.now()}`,
//       type: "custom",
//       label: type,
//       position,
//       data: flowStore.getNodeDataByType(type)
//     };

//     flowStore.addNode(newNode);
//     flowStore.addChildToContainer(node.id, newNode.id);
//   }
// };
</script>

<template>
  <div
    class="container-node transition-colors duration-300"
    :class="[
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      { 'ring-2 ring-blue-500': node.selected }
    ]"
  >
    <!-- Title -->
    <div
      class="container-header"
      :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
    >
      <span :class="isDark ? 'text-white' : 'text-gray-900'">{{
        node.label
      }}</span>
    </div>

    <!-- Content -->
    <div class="container-body">
      <!-- Container content area -->
      <div
        class="container-content"
        :class="isDark ? 'bg-gray-900/50' : 'bg-gray-50/50'"
      >
        <div
          v-if="!node.data.children?.length"
          class="container-placeholder"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        >
          Drag nodes here
        </div>
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <div
      class="container-footer"
      :class="isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'"
    >
      <span
        class="children-count"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
      >
        Children: {{ node.data.children?.length || 0 }}
      </span>
      <ElSwitch
        :model-value="node.data.children && node.data.children.length > 0"
        disabled
        :active-text="'Active'"
        :inactive-text="'Empty'"
      />
    </div>
  </div>
</template>

<style scoped>
.container-node {
  @apply rounded-lg border shadow-lg relative;
  min-width: 300px;
  min-height: 200px;
}

.container-header {
  @apply px-4 py-2 rounded-t-lg font-medium transition-colors duration-300 cursor-move;
}

.container-body {
  @apply p-4 flex-1 flex flex-col gap-4;
  min-height: calc(100% - 88px); /* Header + Footer height */
}

.container-content {
  @apply flex-1 mt-2 rounded-lg border-2 border-dashed transition-colors duration-300
         flex items-center justify-center relative;
  min-height: 120px;
}

.container-placeholder {
  @apply text-sm font-medium transition-colors duration-300 absolute;
  pointer-events: none;
}

.container-footer {
  @apply px-4 py-2 rounded-b-lg transition-colors duration-300
         flex items-center justify-between border-t;
}

.ports {
  @apply flex flex-col gap-2;
}

.port-wrapper {
  @apply flex items-center gap-2 relative;
}

.port-label {
  @apply text-sm transition-colors duration-300;
}

.children-count {
  @apply text-sm font-medium;
}

:deep(.vue-flow__handle) {
  @apply w-3 h-3 transition-colors duration-300;
}

:deep(.handle-dark) {
  @apply bg-blue-500 hover:bg-blue-400;
}

:deep(.handle-light) {
  @apply bg-blue-600 hover:bg-blue-500;
}

:deep(.el-switch) {
  @apply scale-90;
}

:deep(.el-switch__label) {
  @apply text-xs;
}
</style>
