<script setup lang="ts">
import { Position, Handle, useNode } from "@vue-flow/core";
import { useThemeStore } from "@/store/modules/theme";
import { computed, ref, onMounted } from "vue";
import { useElementSize, useResizeObserver } from "@vueuse/core";

// `useNode` returns us the node object straight from the state
// since the node obj is reactive, we can mutate it to update our nodes' data
const { node } = useNode();
// console.log(node);
// const props = defineProps<{
//   data: {
//     inputs?: string[];
//     outputs?: string[];
//   };
//   label?: string;
//   selected?: boolean;
// }>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");

const nodeRef = ref<HTMLElement | null>(null);
const resizing = ref(false);
const { width, height } = useElementSize(nodeRef);

const minWidth = 150;
const minHeight = 100;

const startResize = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  resizing.value = true;

  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = width.value;
  const startHeight = height.value;

  const onMouseMove = (e: MouseEvent) => {
    if (!resizing.value) return;

    const newWidth = Math.max(minWidth, startWidth + (e.clientX - startX));
    const newHeight = Math.max(minHeight, startHeight + (e.clientY - startY));

    if (nodeRef.value) {
      nodeRef.value.style.width = `${newWidth}px`;
      nodeRef.value.style.height = `${newHeight}px`;
    }
  };

  const onMouseUp = () => {
    resizing.value = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};
</script>

<template>
  <div
    ref="nodeRef"
    class="custom-node transition-colors duration-300"
    :class="[
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      { 'ring-2 ring-blue-500': node.selected }
    ]"
  >
    <div
      class="custom-node-header"
      :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
    >
      <span :class="isDark ? 'text-white' : 'text-gray-900'">{{
        node.label
      }}</span>
    </div>
    <div class="custom-node-body">
      <div v-if="node.data.inputs" class="ports inputs">
        <div
          v-for="input in node.data.inputs"
          :key="input"
          class="port-wrapper"
        >
          <Handle
            :id="input"
            type="target"
            :position="Position.Left"
            :class="isDark ? 'handle-dark' : 'handle-light'"
          />
          <Handle
            type="target"
            :position="Position.Left"
            :style="{
              height: '16px',
              width: '6px',
              backgroundColor: node.data?.color,
              filter: 'invert(100%)'
            }"
          />
          <span
            class="port-label"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ input }}
          </span>
        </div>
      </div>
      <div v-if="node.data.outputs" class="ports outputs">
        <div
          v-for="output in node.data.outputs"
          :key="output"
          class="port-wrapper"
        >
          <span
            class="port-label"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ output }}
          </span>
          <Handle
            :id="output"
            type="source"
            :position="Position.Right"
            :class="isDark ? 'handle-dark' : 'handle-light'"
          />
        </div>
      </div>
    </div>
    <!-- Resize handle -->
    <div
      class="resize-handle"
      :class="[
        isDark
          ? 'bg-gray-700 hover:bg-gray-600'
          : 'bg-gray-200 hover:bg-gray-300',
        { active: resizing }
      ]"
      @mousedown="startResize"
    >
      <svg
        class="w-3 h-3"
        :class="isDark ? 'text-gray-400' : 'text-gray-600'"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M22 22H20V20H22V22ZM22 20H20V18H22V20ZM20 22H18V20H20V22ZM20 20H18V18H20V20ZM20 18H18V16H20V18Z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.custom-node {
  @apply rounded-lg border min-w-[150px] shadow-lg relative;
  width: v-bind('width + "px"');
  height: v-bind('height + "px"');
}

.custom-node-header {
  @apply px-4 py-2 rounded-t-lg font-medium transition-colors duration-300 cursor-move;
}

.custom-node-body {
  @apply p-4 flex-1 flex flex-col justify-between;
  height: calc(100% - 40px);
}

.ports {
  @apply flex flex-col gap-4;
}

.port-wrapper {
  @apply flex items-center gap-2 relative;
}

.port-label {
  @apply text-sm transition-colors duration-300;
}

.resize-handle {
  @apply absolute bottom-0 right-0 w-4 h-4 rounded-bl cursor-se-resize 
         flex items-center justify-center transition-colors duration-200;
}

.resize-handle.active {
  @apply ring-2 ring-blue-500;
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
</style>
