<script setup lang="ts">
import { ref, computed } from "vue";
import { useFlowStore } from "@/store/modules/flow";
import { useThemeStore } from "@/store/modules/theme";
import { ElButton, ElTooltip, ElDivider, ElSwitch } from "element-plus";
import "element-plus/theme-chalk/el-button.css";
import "element-plus/theme-chalk/el-tooltip.css";
import "element-plus/theme-chalk/el-divider.css";

const flowStore = useFlowStore();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");
const isRunning = ref(false);
const isPaused = ref(false);

const menus = [
  {
    id: "file",
    label: "文件",
    items: [
      { id: "new", label: "新建", icon: "Plus" },
      { id: "new-folder", label: "新建文件夹", icon: "Folder" },
      { id: "save", label: "保存", icon: "Download" },
      { id: "import", label: "导入", icon: "Upload" },
      { id: "export", label: "导出", icon: "Download" }
    ]
  },
  {
    id: "status",
    label: "状态",
    items: [
      { id: "undo", label: "撤销", icon: "Back" },
      { id: "redo", label: "重做", icon: "Right" },
      { id: "clear", label: "清空", icon: "Delete" },
      { id: "reset", label: "还原", icon: "RefreshRight" }
    ]
  },
  {
    id: "content",
    label: "内容",
    items: [
      { id: "add-node", label: "添加节点", icon: "Plus" },
      { id: "add-container", label: "添加容器", icon: "Box" }
    ]
  },
  {
    id: "properties",
    label: "属性",
    items: [
      { id: "edit", label: "编辑属性", icon: "Edit" },
      { id: "layout", label: "布局设置", icon: "SetUp" }
    ]
  },
  {
    id: "run",
    label: "运行",
    items: [
      { id: "start", label: "开始", icon: "VideoPlay" },
      { id: "stop", label: "停止", icon: "VideoPause" },
      { id: "debug", label: "调试", icon: "Monitor" }
    ]
  }
];

const toggleRun = () => {
  if (isPaused.value) {
    isPaused.value = false;
    return;
  }
  isRunning.value = !isRunning.value;
  isPaused.value = false;
};

const togglePause = () => {
  if (!isRunning.value) return;
  isPaused.value = !isPaused.value;
};

const stop = () => {
  isRunning.value = false;
  isPaused.value = false;
};

const undo = () => {
  flowStore.undo();
};

const redo = () => {
  flowStore.redo();
};

const handleCommand = () => {};
</script>

<template>
  <div
    class="toolbar menu-bar p-2 flex items-center gap-2 border-b transition-colors duration-300"
    :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
  >
    <div class="menu-container">
      <div class="menu-items">
        <el-dropdown
          v-for="menu in menus"
          :key="menu.id"
          trigger="hover"
          @command="handleCommand"
        >
          <span class="menu-label">{{ menu.label }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="item in menu.items"
                :key="item.id"
                :command="`${menu.id}:${item.id}`"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <ElTooltip content="Run/Resume" placement="bottom">
        <ElButton
          :type="isRunning && !isPaused ? 'success' : 'primary'"
          circle
          @click="toggleRun"
        >
          <i class="icon">{{ isRunning && !isPaused ? "⏸" : "▶" }}</i>
        </ElButton>
      </ElTooltip>

      <ElTooltip content="Pause" placement="bottom">
        <ElButton
          :type="isPaused ? 'warning' : 'info'"
          circle
          :disabled="!isRunning"
          @click="togglePause"
        >
          <i class="icon">⏸</i>
        </ElButton>
      </ElTooltip>

      <ElTooltip content="Stop" placement="bottom">
        <ElButton
          type="danger"
          circle
          :disabled="!isRunning && !isPaused"
          @click="stop"
        >
          <i class="icon">⏹</i>
        </ElButton>
      </ElTooltip>
    </div>

    <ElDivider direction="vertical" />

    <div class="flex items-center gap-2">
      <ElTooltip content="Undo" placement="bottom">
        <ElButton circle @click="undo">
          <i class="icon">↩</i>
        </ElButton>
      </ElTooltip>

      <ElTooltip content="Redo" placement="bottom">
        <ElButton circle @click="redo">
          <i class="icon">↪</i>
        </ElButton>
      </ElTooltip>
    </div>

    <ElDivider direction="vertical" />

    <div class="status-indicator flex items-center gap-2">
      <span
        class="text-sm transition-colors duration-300"
        :class="isDark ? 'text-gray-300' : 'text-gray-600'"
      >
        Status:
      </span>
      <span
        class="text-sm font-medium"
        :class="{
          'text-green-400': isRunning && !isPaused,
          'text-yellow-400': isPaused,
          'text-gray-400': !isRunning && !isPaused
        }"
      >
        {{ isRunning ? (isPaused ? "Paused" : "Running") : "Stopped" }}
      </span>
    </div>
    <div class="flex-1" />
    <ElSwitch
      v-model="isDark"
      :active-text="'🌙'"
      :inactive-text="'☀️'"
      inline-prompt
      class="ml-auto"
      @change="themeStore.toggleTheme"
    />
    <ElTooltip content="Settings" placement="bottom">
      <ElButton circle>
        <i class="icon">⚙</i>
      </ElButton>
    </ElTooltip>
  </div>
</template>

<style lang="scss" scoped>
.toolbar {
  height: 56px;
}

.icon {
  @apply text-lg not-italic leading-none;
}

:deep(.el-button) {
  @apply transition-colors duration-300;
}

:deep(.el-divider) {
  @apply transition-colors duration-300;
}

:deep(.el-divider--vertical) {
  @apply dark:border-gray-700 border-gray-200;
}
.menu-bar {
  border-bottom: 1px solid #dcdfe6;
  transition: all 0.3s ease;

  .menu-container {
    position: relative;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-items {
    display: flex;
    gap: 24px;
  }

  .menu-label {
    font-size: 14px;
    color: border-gray-200;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;

    &:hover {
      background: #f5f7fa;
      color: #409eff;
    }
  }

  .toggle-button {
    position: absolute;
    bottom: -24px;
    right: 16px;
    width: 32px;
    height: 24px;
    background: white;
    border: 1px solid #dcdfe6;
    border-top: none;
    border-radius: 0 0 4px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 100;

    &:hover {
      background: #f5f7fa;
      color: #409eff;
    }
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;

  .el-icon {
    font-size: 16px;
  }
}
/* Select Control and Control Button */
.vue-flow__controls {
  padding: 0.15rem;
  background-color: white;
  border-radius: 1rem;
}

.vue-flow__controls-button {
  margin: 0.3rem;
  border: 1px grey solid;
}
</style>
