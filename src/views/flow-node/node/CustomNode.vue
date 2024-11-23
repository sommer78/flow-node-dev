<script setup lang="ts">
import { Position, Handle, useNode } from "@vue-flow/core";
import { useThemeStore } from "@/store/modules/theme";

import { useFlowStore } from "@/store/modules/flow";
// import { ElSwitch } from "element-plus";
import NodeContextMenu from "../NodeContextMenu.vue";

// const props = defineProps<{
//   id: string;
//   data: {
//     inputs?: string[];
//     outputs?: string[];
//     content?: string;
//     status?: boolean;
//   };
//   label?: string;
//   selected?: boolean;
// }>();
const { node } = useNode();
const flowStore = useFlowStore();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");
const status = ref(node.data.status ?? false);

// Context menu state
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });

const toggleStatus = () => {
  status.value = !status.value;
};

const onContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();

  showContextMenu.value = true;
  contextMenuPosition.value = {
    x: Math.min(event.clientX, window.innerWidth - 180),
    y: Math.min(event.clientY, window.innerHeight - 100)
  };
};

const closeContextMenu = () => {
  showContextMenu.value = false;
};

const handleEdit = () => {
  // Implement edit functionality
  closeContextMenu();
};

const handleDelete = () => {
  flowStore.removeNode(node.id);
  closeContextMenu();
};
</script>

<template>
  <div
    class="custom-node transition-colors duration-300"
    :class="[
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
      { 'ring-2 ring-blue-500': node.selected }
    ]"
    @contextmenu="onContextMenu"
  >
    <!-- Title -->
    <div
      class="custom-node-header"
      :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
    >
      <span :class="isDark ? 'text-white' : 'text-gray-900'">{{
        node.label
      }}</span>
    </div>

    <!-- Content -->
    <div class="custom-node-body">
      <!-- Input/Output ports -->
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
          <span
            class="port-label"
            :class="isDark ? 'text-gray-300' : 'text-gray-600'"
          >
            {{ input }}
          </span>
        </div>
      </div>

      <!-- Main content area -->
      <div
        class="content-area"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
      >
        {{ node.data.content || "No content available" }}
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

    <!-- Footer -->
    <div
      class="custom-node-footer"
      :class="isDark ? 'bg-gray-700/50' : 'bg-gray-100/50'"
    >
      <span
        class="status-label"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
      >
        Status
      </span>
      <ElSwitch
        v-model="status"
        :active-text="'On'"
        :inactive-text="'Off'"
        @change="toggleStatus"
      />
    </div>

    <!-- Context Menu -->
    <Teleport to="body">
      <NodeContextMenu
        v-if="showContextMenu"
        :position="contextMenuPosition"
        :onClose="closeContextMenu"
        :onEdit="handleEdit"
        :onDelete="handleDelete"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.custom-node {
  @apply rounded-lg border shadow-lg relative;
  width: 250px;
}

.custom-node-header {
  @apply px-4 py-2 rounded-t-lg font-medium transition-colors duration-300 cursor-move;
}

.custom-node-body {
  @apply p-4 flex-1 flex flex-col gap-4;
}

.custom-node-footer {
  @apply px-4 py-2 rounded-b-lg transition-colors duration-300
         flex items-center justify-between border-t;
}

.content-area {
  @apply p-2 rounded-lg min-h-[60px] text-sm;
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

.status-label {
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
