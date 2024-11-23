<script setup lang="ts">
import { ref, computed } from "vue";
import { useFlowStore } from "@/store/modules/flow";
import { useThemeStore } from "@/store/modules/theme";
// import { ElCollapse, ElCollapseItem, ElSwitch } from "element-plus";
// import "element-plus/theme-chalk/el-collapse.css";
// import "element-plus/theme-chalk/el-collapse-item.css";
// import "element-plus/theme-chalk/el-switch.css";
import type { NodeContentType } from "../../../types/flow";
import ArrowLeft from "@iconify-icons/ep/arrow-left-bold";
import ArrowRight from "@iconify-icons/ep/arrow-right-bold";
import iconApi from "@/assets/images/icon-api.png";
import iconLLM from "@/assets/images/icon-LLM.png";
import iconCode from "@/assets/images/icon-code.png";
import iconKnowledge from "@/assets/images/icon-knowledge.png";
import iconWorkflow from "@/assets/images/icon-workflow.png";
import iconImageflow from "@/assets/images/icon-imageflow.png";
import iconCondition from "@/assets/images/icon-condition.png";
import iconText from "@/assets/images/icon-text.png";
import iconMessager from "@/assets/images/icon-messager.png";
import iconVariable from "@/assets/images/icon-variable.png";
import iconDatabase from "@/assets/images/icon-database.png";

interface NodeTemplate {
  id: string;
  label: string;
  type: string;
  contentType?: NodeContentType;
  icon?: string;
  description?: string;
  disabled?: boolean;
  tooltip?: string;
}

interface NodeCategory {
  id: string;
  label: string;
  nodes: NodeTemplate[];
}
const flowStore = useFlowStore();
const themeStore = useThemeStore();
const isOpen = ref(true);

const isDark = computed(() => themeStore.theme === "dark");
const isCollapsed = ref(false);

const categories: NodeCategory[] = [
  {
    id: "file",
    label: "文件节点",
    nodes: [
      {
        type: "custom",
        contentType: "document",
        label: "插件",
        id: "10000",
        icon: iconApi,
        disabled: true,
        tooltip: "通过添加工具访问实时数据和执行外部操作"
      },
      {
        type: "LLM",
        contentType: "document",
        label: "大模型",
        id: "10002",
        icon: iconLLM,
        disabled: false,
        tooltip: "调用大语言模型,使用变量和提示词生成回复"
      },
      {
        type: "new",
        contentType: "document",
        label: "代码",
        id: "10003",
        icon: iconCode,
        disabled: true,

        tooltip: "编写代码，处理输入变量来生成返回值"
      },
      {
        type: "knowledge",
        contentType: "document",
        label: "知识库",
        id: "10004",
        icon: iconKnowledge,
        disabled: false,
        tooltip: "在选定的知识中,根据输入变量召回最匹配的信息,并以列表形式返回"
      },
      {
        type: "workflow",
        contentType: "document",
        label: "工作流",
        id: "10005",
        icon: iconWorkflow,
        disabled: true,
        tooltip: "集成已发布工作流，可以执行嵌套子任务"
      },
      {
        type: "imageflow",
        label: "图像流",
        id: "10006",
        icon: iconImageflow,
        disabled: true,
        tooltip: "集成已发布图像流，可以执行嵌套子任务"
      },
      {
        type: "condition",
        label: "选择器",
        id: "10007",
        icon: iconCondition,
        disabled: false,
        tooltip:
          "连接多个下游分支，若设定的条件成立则仅运行对应的分支，若均不成立则只运行“否则”分支"
      },
      {
        type: "text",
        label: "文本处理",
        id: "10008",
        icon: iconText,
        disabled: false,
        tooltip: "用于处理多个字符串类型变量的格式"
      },
      {
        type: "messager",
        label: "消息",
        id: "10009",
        icon: iconMessager,
        disabled: true,
        tooltip: "支持中间过程的消息输出，支持流式和非流式两种方式"
      },
      {
        type: "variable",
        label: "变量",
        id: "10010",
        icon: iconVariable,
        disabled: true,
        tooltip:
          "用于读取和写入机器人中的变量。变量名称必须与机器人中的变量名称相匹配。"
      },
      {
        type: "database",
        label: "数据库",
        id: "10011",
        icon: iconDatabase,
        disabled: true,
        tooltip:
          "可支持对 Database 放开读写控制，用户可读写其他用户提交的数据，由开发者控制。需要提前在 Bot 的 Database 中添加 Table。"
      }
    ]
  },
  {
    id: "content",
    label: "内容节点",
    nodes: [
      {
        id: "text",
        label: "文本节点",
        type: "custom",
        contentType: "document",
        icon: "Edit"
      },
      {
        id: "code",
        label: "代码节点",
        type: "custom",
        contentType: "code",
        icon: "Terminal"
      },
      {
        id: "data",
        label: "数据节点",
        type: "custom",
        contentType: "code",
        icon: "DataLine"
      }
    ]
  },
  {
    id: "model",
    label: "模型节点",
    nodes: [
      {
        id: "circuit",
        label: "电路图",
        type: "custom",
        contentType: "circuit",
        icon: "Connection"
      },
      {
        id: "pcb",
        label: "PCB设计",
        type: "custom",
        contentType: "pcb",
        icon: "Cpu"
      }
    ]
  },
  {
    id: "container",
    label: "容器节点",
    nodes: [
      {
        id: "group",
        label: "分组容器",
        type: "container",
        contentType: "document",
        icon: "FolderOpened"
      },
      {
        id: "flow",
        label: "流程容器",
        type: "container",
        contentType: "document",
        icon: "Share"
      }
    ]
  }
];

const handleDragStart = (event: DragEvent, node: NodeTemplate) => {
  if (event.dataTransfer) {
    //  JSON.stringify(node)
    // console.log(node);
    event.dataTransfer.setData("application/flownode", JSON.stringify(node));
    event.dataTransfer.effectAllowed = "copy";
  }
  //  if (event.dataTransfer) {
  //   event.dataTransfer.setData(
  //     'application/node-template',
  //     JSON.stringify(node)
  //   );
  //   event.dataTransfer.effectAllowed = 'copy';
  // }
};

const togglePanel = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div
    class="border-r transition-all duration-300 flex flex-col"
    :class="[
      'node-selector-panel',
      { collapsed: isCollapsed },
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    ]"
  >
    <div
      class="p-4 border-b flex items-center justify-between"
      :class="isDark ? 'border-gray-700' : 'border-gray-200'"
    >
      <div v-show="isOpen" class="flex items-center gap-3">
        <h2
          class="font-semibold"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          节点选择器
        </h2>
      </div>
    </div>

    <div class="overflow-y-auto flex-1">
      <ElCollapse>
        <ElCollapseItem
          v-for="category in categories"
          :key="category.id"
          :title="category.label"
          :name="category.id"
        >
          <div class="node-list">
            <div
              v-for="node in category.nodes"
              :key="node.id"
              class="node-item p-3 rounded-lg cursor-move transition-colors"
              :class="
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              "
              draggable="true"
              @dragstart="handleDragStart($event, node)"
            >
              <img
                :src="node.icon"
                :alt="'m-i-icon-' + node.type"
                class="m-i-icon"
              />
              <span class="node-label">{{ node.label }}</span>
            </div>
          </div>
        </ElCollapseItem>
      </ElCollapse>
    </div>
    <div class="panel-toggle-wrapper">
      <div
        class="panel-toggle"
        :class="
          isDark
            ? 'bg-gray-700 hover:bg-gray-600'
            : 'bg-gray-100 hover:bg-gray-200'
        "
        @click="togglePanel"
      >
        <IconifyIconOffline :icon="isOpen ? ArrowLeft : ArrowRight" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-item {
  @apply border-none bg-transparent;
}

:deep(.el-collapse) {
  @apply border-none;
}

:deep(.el-collapse-item__header) {
  @apply border-none px-4 py-2 transition-colors;
}

:deep(.el-collapse-item__header) {
  @apply dark:bg-transparent dark:text-white dark:hover:bg-gray-700
         bg-transparent text-gray-900 hover:bg-gray-100;
}

:deep(.el-collapse-item__content) {
  @apply dark:bg-transparent dark:text-white
         bg-transparent text-gray-900
         p-4 pt-0;
}

:deep(.el-collapse-item__wrap) {
  @apply bg-transparent border-none;
}

:deep(.el-switch__core) {
  @apply dark:border-gray-600 border-gray-300;
}

.m-i-icon {
  flex-shrink: 0;
  margin-right: 6px;
  height: 28px;
  width: 28px;
}
.node-selector-panel {
  position: relative;
  width: 300px;
  height: 100%;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;

  &.collapsed {
    transform: translateX(-100%);

    .panel-toggle {
      transform: rotate(180deg);
    }
  }

  .node-selector {
    flex: 1;
    padding: 16px;
    height: 100%;
    overflow-y: auto;

    .selector-title {
      margin: 0 0 16px;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .node-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      padding: 4px;
    }

    .node-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f5f7fa;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      cursor: move;
      transition: all 0.2s ease;

      &:hover {
        background: #ecf5ff;
        border-color: #409eff;
      }

      .m-i-icon {
        flex-shrink: 0;
        margin-right: 6px;
        height: 28px;
        width: 28px;
      }

      .node-label {
        font-size: 12px;
        color: #606266;
      }
    }
  }

  .panel-toggle-wrapper {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
  }

  .panel-toggle {
    width: 20px;
    height: 40px;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: transform 0.3s ease;

    &:hover {
      background: #f5f7fa;
    }

    i {
      font-size: 12px;
    }
  }
}

:deep(.el-collapse) {
  border: none;

  .el-collapse-item__header {
    font-size: 14px;
    font-weight: 500;
    padding: 0 8px;
  }

  .el-collapse-item__content {
    padding: 16px 8px;
  }
}
</style>
