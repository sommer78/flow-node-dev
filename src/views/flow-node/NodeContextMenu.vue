<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { ElButton } from "element-plus";
import "element-plus/theme-chalk/el-button.css";

const props = defineProps<{
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");

const menuStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`
}));
</script>

<template>
  <div
    class="fixed z-50 rounded-lg shadow-xl border transition-colors duration-300 min-w-[160px]"
    :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
    :style="menuStyle"
  >
    <div class="p-1 flex flex-col gap-1">
      <ElButton class="menu-item" text @click="onEdit">
        <div class="flex items-center">
          <span class="icon">✏️</span>
          <span>Edit</span>
        </div>
      </ElButton>

      <ElButton class="menu-item" text @click="onDelete">
        <div class="flex items-center">
          <span class="icon">🗑️</span>
          <span>Delete</span>
        </div>
      </ElButton>
    </div>
  </div>

  <!-- Backdrop -->
  <div class="fixed inset-0 z-40" @click="onClose" />
</template>

<style scoped>
.menu-item {
  @apply w-full justify-start px-3 py-2 transition-colors duration-200;
}

:deep(.el-button) {
  @apply dark:text-gray-300 dark:hover:bg-gray-700
         text-gray-700 hover:bg-gray-100;
}

.icon {
  @apply text-base leading-none;
}
</style>
