<script setup lang="ts">
// import { ref, computed } from "vue";
// import { ElTabs, ElTabPane, ElDrawer } from "element-plus";
import type {
  FlowNode,
  NodeContentType,
  CodeLanguage
} from "../../../types/flow";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { useFlowStore } from "@/store/modules/flow";
import MarkdownPreview from "./viewers/MarkdownPreview.vue";
import CircuitViewer from "./viewers/CircuitViewer.vue";

const contentTypes: { label: string; value: NodeContentType }[] = [
  { label: "电路图", value: "circuit" },
  { label: "PCB", value: "pcb" },
  { label: "文档", value: "document" },
  { label: "代码", value: "code" }
];

const codeLanguages: { label: string; value: CodeLanguage }[] = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "C++", value: "cpp" },
  { label: "Java", value: "java" }
];
const props = defineProps<{
  selectedNode: FlowNode | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  "update:visible": [value: boolean];
}>();

const flowStore = useFlowStore();
const activeTab = ref("properties");

const nodeContent = computed(() => {
  if (!props.selectedNode?.data) return "{}";
  return JSON.stringify(props.selectedNode.data, null, 2);
});

const handleContentChange = (value: string) => {
  if (!props.selectedNode) return;
  try {
    const newData = JSON.parse(value);
    // flowStore.updateNode(props.selectedNode.id, {
    //   ...props.selectedNode,
    //   data: newData
    // })
  } catch (e) {
    console.error("Invalid JSON:", e);
  }
};

const handleClose = () => {
  console.log("Drawer closed");
  emit("update:visible", false);
};

const editorOptions = {
  theme: oneDark,
  extensions: [javascript()],
  tabSize: 2,
  autocompletion: true
};

const getContentComponent = computed(() => {
  if (!props.selectedNode?.data.contentType) return null;

  switch (props.selectedNode.data.contentType) {
    case "circuit":
    case "pcb":
      return CircuitViewer;
    case "document":
      return MarkdownPreview;
    case "code":
      return Codemirror;
    default:
      return null;
  }
});
</script>
<!--  @update:model-value="emit('update:visible', $event)" -->
<template>
  <el-drawer
    title="节点详情"
    size="600px"
    :model-value="visible"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-if="selectedNode" class="node-details">
      <el-tabs v-model="activeTab" class="details-tabs">
        <el-tab-pane label="属性" name="properties">
          <div class="tab-content">
            <div class="detail-item">
              <span class="label">ID:</span>
              <span>{{ selectedNode.id }}</span>
            </div>
            <div class="detail-item">
              <span class="label">类型:</span>
              <span>{{ selectedNode.type }}</span>
            </div>
            <div class="detail-item">
              <span class="label">标签:</span>
              <span>{{ selectedNode.label }}</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="内容" name="content">
          <div class="tab-content">
            <component
              :is="getContentComponent"
              v-if="getContentComponent"
              v-model="selectedNode.data.content"
              :content="selectedNode.data.content"
              :file-type="selectedNode.data.fileType"
              :style="{ height: '400px' }"
              :autofocus="selectedNode.data.contentType === 'code'"
              :indent-with-tab="selectedNode.data.contentType === 'code'"
              :tab-size="2"
              :extensions="
                selectedNode.data.contentType === 'code'
                  ? editorOptions.extensions
                  : undefined
              "
              :theme="
                selectedNode.data.contentType === 'code'
                  ? editorOptions.theme
                  : undefined
              "
              @change="handleContentChange"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="状态" name="state">
          <div class="tab-content">
            <div class="detail-item">
              <span class="label">位置 X:</span>
              <span>{{ selectedNode.position.x }}</span>
            </div>
            <div class="detail-item">
              <span class="label">位置 Y:</span>
              <span>{{ selectedNode.position.y }}</span>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="设置" name="settings">
          <div class="tab-content">
            <div class="detail-item">
              <span class="label">可拖拽:</span>
              <span>{{ selectedNode.draggable !== false ? "是" : "否" }}</span>
            </div>
            <div class="detail-item">
              <span class="label">可连接:</span>
              <span>{{
                selectedNode.connectable !== false ? "是" : "否"
              }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.node-details {
  .details-tabs {
    padding: 16px;
  }

  .tab-content {
    padding: 8px;
  }

  .detail-item {
    margin-bottom: 12px;
    display: flex;
    align-items: flex-start;

    .label {
      font-weight: bold;
      min-width: 80px;
      margin-right: 8px;
    }
  }
}

:deep(.el-drawer__body) {
  padding: 0;
}

:deep(.cm-editor) {
  height: 100%;
  font-family: "Fira Code", monospace;

  .cm-scroller {
    overflow: auto;
  }
}
</style>
