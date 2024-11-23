<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { useI18n } from "vue-i18n";
import { ElButton } from "element-plus";
import "element-plus/theme-chalk/el-button.css";

const props = defineProps<{
  position: { x: number; y: number };
  onClose: () => void;
  onAddNode: () => void;
  onClear: () => void;
}>();
const { t } = useI18n();
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
    <div class="p-1 flex flex-col">
      <ElButton class="menu-item" text @click="onAddNode">
        <div class="flex items-center">
          <span class="icon">➕</span>
          <span>{{ t("node.AddNode") }}</span>
        </div>
      </ElButton>
      <ElButton class="menu-item" text @click="onClear">
        <div class="flex items-center">
          <span class="icon">🗑️</span>
          <span>{{ t("node.ClearAll") }}</span>
        </div>
      </ElButton>
      <ElButton class="menu-item" text @click="onAddNode">
        <div class="flex items-center">
          <span class="icon">➕</span>
          <span>{{ t("node.AddNode") }}</span>
        </div>
      </ElButton>
      <ElButton class="menu-item" text @click="onAddNode">
        <div class="flex items-center">
          <span class="icon">➕</span>
          <span>{{ t("node.AddNode") }}</span>
        </div>
      </ElButton>
    </div>
  </div>

  <!-- Backdrop -->
  <div class="fixed inset-0 z-40" @click="onClose" />
</template>

<style scoped>
.menu-item {
  @apply w-full justify-start transition-colors;
}

:deep(.el-button) {
  @apply dark:text-gray-300 dark:hover:bg-gray-700
         text-gray-700 hover:bg-gray-100;
}

.icon {
  @apply text-base leading-none;
}
</style>
