<script setup lang="ts">
import { VueFlow, useVueFlow, NodeMouseEvent, Node } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
// import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { useFlowStore } from "@/store/modules/flow";
import { useThemeStore } from "@/store/modules/theme";
import CustomNode from "./node/CustomNode.vue";
import CommonNode from "./node/CommonNode.vue";
import ContainerNode from "./node/ContainerNode.vue";

import NodeDetails from "./NodeDetails.vue";
import FlowControls from "./controls/FlowControls.vue";
import Sidebar from "./Sidebar.vue";
import Toolbar from "./Toolbar.vue";
import { ref, watch, computed, markRaw } from "vue";
import type { FlowNode } from "../../../types/flow";
import EditorContextMenu from "./EditorContextMenu.vue";
import { useI18n } from "vue-i18n";
import { transformI18n, $t } from "@/plugins/i18n";
import AnimationEdge from "./node/AnimationEdge.vue";
import StartNode from "./node/StartNode.vue";
import EndNode from "./node/EndNode.vue";
import BigModelNode from "./node/BigModelNode.vue";
import KnowledgeNode from "./node/KnowledgeNode.vue";

import TextNode from "./node/TextNode.vue";
import ConditionNode from "./node/ConditionNode.vue";
import "element-plus/dist/index.css";

const nodesTypeObj: any = {
  "10000": StartNode, // 开始节点
  "10002": BigModelNode, // 大模型节点
  "10004": KnowledgeNode, // 知识模型节点
  "10007": ConditionNode, // 条件节点
  "10008": TextNode, // 文本节点
  "20000": EndNode // 结束节点
};
const flowStore = useFlowStore();
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");
// Context menu state
const showContextMenu = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });

const nodeTypes = {
  custom: markRaw(CustomNode),
  common: markRaw(CommonNode),
  container: markRaw(ContainerNode),
  start: markRaw(StartNode)
  // special: markRaw(SpecialNode),
};

const edgeTypes = {
  animation: markRaw(AnimationEdge)
};
const selectedNode = ref<FlowNode | null>(null);
const showNodeDetails = ref(false);
const { onPaneReady, project } = useVueFlow();

// {
//   defaultViewport: { x: 0, y: 0, zoom: 1 },
//   fitViewOnInit: true,
//   deleteKeyCode: "Delete",
//   selectionKeyCode: "Shift",
//   multiSelectionKeyCode: "Control",
//   onNodeDragStop: (e, node) => {
//     flowStore.updateNodePosition(node.id, node.position);
//   },
//   onNodesDelete: nodes => {
//     nodes.forEach(node => flowStore.removeNode(node.id));
//   },
//   onEdgesDelete: edges => {
//     edges.forEach(edge => flowStore.removeEdge(edge.id));
//   }
// }

// const nodes = ref(flowStore.nodes);
// const edges = ref(flowStore.edges);

// watchEffect(() => {
//   nodes.value = flowStore.nodes;
//   edges.value = flowStore.edges;
// });
watch(
  () => flowStore.nodes,
  newNodes => {
    console.log("Nodes updated:", newNodes);
  },
  { deep: true }
);

const onContextMenu = (event: MouseEvent) => {
  // Only show context menu if clicking on the canvas, not on nodes
  if ((event.target as HTMLElement).closest(".custom-node")) {
    return;
  }

  event.preventDefault();
  showContextMenu.value = true;
  contextMenuPosition.value = {
    x: Math.min(event.clientX, window.innerWidth - 180),
    y: Math.min(event.clientY, window.innerHeight - 100)
  };
};

const closeContextMenu = () => {
  showContextMenu.value = false;
};

const handleClear = () => {
  flowStore.nodes.forEach(node => flowStore.removeNode(node.id));
  closeContextMenu();
};
const handleAddNode = () => {
  const position = project({
    x: contextMenuPosition.value.x,
    y: contextMenuPosition.value.y
  });
  const nodeId = "10000";
  const newNode: Node = {
    id: `node_${Date.now()}`,
    type: "custom",
    label: markRaw(nodesTypeObj[nodeId]),
    position,
    data: {
      inputs: ["input"],
      outputs: ["output"],
      content: "New node content"
    }
  };

  flowStore.addNode(newNode);
  closeContextMenu();
};

onPaneReady(({ fitView }) => {
  fitView();
});

const onDrop = (event: DragEvent) => {
  event.preventDefault();
  const flowNode = event.dataTransfer?.getData("application/flownode");
  if (!flowNode) return;
  console.log(flowNode);
  const node = JSON.parse(flowNode);
  const bounds = (event.target as HTMLElement).getBoundingClientRect();
  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top
  });
  // const { x, y } = project({ x: event.clientX, y: event.clientY });
  const nodeId = node.id;
  const newNode: Node = {
    id: `${node.id}-${Date.now()}`,
    type: node.type,
    position,
    label: markRaw(nodesTypeObj[nodeId]),
    data: flowStore.getNodeDataByType(node.type),
    style:
      node.type === "container"
        ? {
            width: 400,
            height: 300,
            padding: "20px"
          }
        : undefined
  };
  flowStore.addNode(newNode);
  // console.log(event);
  // const type = event.dataTransfer?.getData("application/flownode");
  // console.log(type);

  // if (type) {
  //   const bounds = (event.target as HTMLElement).getBoundingClientRect();
  //   const position = project({
  //     x: event.clientX - bounds.left,
  //     y: event.clientY - bounds.top
  //   });
  //   const nodeId = "10000";
  //   const newNode: Node = {
  //     id: `common_${Date.now()}`,
  //     type: type === "Container" ? "container" : "custom",
  //     label: markRaw(nodesTypeObj[nodeId]),
  //     position,
  //     data: flowStore.getNodeDataByType(type)
  //   };

  //   flowStore.addNode(newNode);
  // }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onNodeClick = (nodeMouseEvent: NodeMouseEvent) => {
  selectedNode.value = {
    id: nodeMouseEvent.node.id,
    type: nodeMouseEvent.node.type,
    label: nodeMouseEvent.node.data,
    position: nodeMouseEvent.node.position,
    data: nodeMouseEvent.node.data,
    draggable: nodeMouseEvent.node.draggable,
    connectable: nodeMouseEvent.node.connectable
  };

  // selectedNode.value = nodeMouseEvent.node;
  console.log(selectedNode);
  showNodeDetails.value = true;
};
</script>
<!-- :nodeTypes="nodeTypes" -->
<template>
  <div
    class="flex flex-col h-screen w-screen transition-colors duration-300"
    :class="isDark ? 'bg-gray-900' : 'bg-gray-50'"
  >
    <Toolbar />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar />
      <div
        class="flex-1 h-full"
        @drop="onDrop"
        @dragover="onDragOver"
        @contextmenu="onContextMenu"
      >
        <VueFlow
          class="customnodeflow"
          :nodes="flowStore.nodes"
          :edges="flowStore.edges"
          :class="isDark ? 'dark' : 'light'"
          :edge-types="edgeTypes"
          :nodeTypes="nodeTypes"
          @connect="flowStore.onConnect"
          @node-double-click="onNodeClick"
        >
          <Background
            :pattern-color="isDark ? '#374151' : '#E5E7EB'"
            :bg-color="isDark ? '#111827' : '#F9FAFB'"
          />
          <FlowControls />
          <MiniMap pannable zoomable />
          <!-- <template #edge-animation="props">
            <AnimationEdge v-bind="props" />
          </template> -->
        </VueFlow>
        <!-- Editor Context Menu -->
        <Teleport to="body">
          <EditorContextMenu
            v-if="showContextMenu"
            :position="contextMenuPosition"
            :onClose="closeContextMenu"
            :onAddNode="handleAddNode"
            :onClear="handleClear"
          />
        </Teleport>

        <node-details
          :visible="showNodeDetails"
          :selected-node="selectedNode"
        />
      </div>
    </div>
  </div>
</template>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
@import "@vue-flow/controls/dist/style.css";
@import "@vue-flow/minimap/dist/style.css";

.vue-flow-wrapper {
  @apply transition-colors duration-300;
}

.vue-flow-wrapper.dark {
  @apply bg-gray-900;
}

.vue-flow-wrapper.light {
  @apply bg-gray-50;
}

.vue-flow__edge.animated path {
  stroke-dasharray: 5;
  animation: dashdraw 1s linear infinite;
}

@keyframes dashdraw {
  from {
    stroke-dashoffset: 10;
  }
}
/* Select the MiniMap */
.vue-flow__minimap {
  border-radius: 10%;
}

/* Select Control and Control Button */
.vue-flow__controls {
  padding: 0.15rem;
  background-color: white;
  border-radius: 2rem;
}

.vue-flow__controls-button {
  margin: 0.3rem;
  border: 1px grey solid;
}

fade-enter-active,
.fade-leave-active {
  transition: opacity 1s 0.1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.customnodeflow button {
  width: 25px;
  height: 25px;
  padding: 5px;
  cursor: pointer;
  border-radius: 25px;
  box-shadow: 0 5px 10px #0000004d;
}

.customnodeflow button:hover {
  opacity: 0.9;
  transition: 0.25s all ease;
  transform: scale(105%);
}

.customnodeflow.dark {
  background: #000000;
  color: #fffffb;
}
.customnodeflow.dark .vue-flow__node {
  background: hsl(0, 0%, 10%);
  color: #fffffb;
}

.customnodeflow .vue-flow__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.customnodeflow.dark .vue-flow__controls {
  border: 1px solid #fffffb;
}
.customnodeflow .vue-flow__controls .vue-flow__controls-button {
  border: none;
  border-right: 1px solid #eee;
}
.customnodeflow.dark .vue-flow__controls .vue-flow__controls-button {
  background: hsl(0, 0%, 20%);
  fill: #fffffb;
  border: none;
}
.customnodeflow.dark .vue-flow__controls .vue-flow__controls-button:hover {
  background: hsl(0, 0%, 30%);
}
.customnodeflow.dark .vue-flow__edge-textbg {
  fill: #292524;
}
.customnodeflow.dark .vue-flow__edge-text {
  fill: #fffffb;
}

/* VueFlow Specifics */
/* .vue-flow {
  background-color: #f2f5f7;
} */

/* .vue-flow__node-start {
  border: 1px solid #777;
  padding: 10px;
  border-radius: 10px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
} 
*/
.vue-flow__node-default {
  --vf-handle: var(--vf-node-color, #1a192b);
  --vf-box-shadow: var(--vf-node-color, #1a192b);
  background: #fff;
  border: 1px solid rgba(28, 31, 35, 0.08);
  border-radius: 8px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: 12px;
}

.vue-flow__node-default.selectable:hover,
.vue-flow__node-default:hover {
  box-shadow:
    0 0 1px rgba(0, 0, 0, 0.3),
    0 4px 14px rgba(0, 0, 0, 0.1);
}

.vue-flow__node-default.selected,
.vue-flow__node.selectable:focus,
.vue-flow__node-default:focus,
.vue-flow__node-default:focus-visible {
  outline: none;
  border: 2px solid #4d53e8;
}

/* Customize Handle */
.handle {
  cursor: pointer !important;
}
</style>
