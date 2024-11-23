<script setup lang="ts">
import { onMounted, watch, ref } from "vue";
import {
  VueFlow,
  useVueFlow,
  NodeMouseEvent,
  Node,
  Position,
  Panel,
  EdgeChange
} from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { MiniMap } from "@vue-flow/minimap";
import { useThemeStore } from "@/store/modules/theme";
import { useFlowStore } from "@/store/modules/flow";
// import FlowControls from './FlowControls.vue';
import NodeDetails from "./NodeDetails.vue";
import Sidebar from "./Sidebar.vue";
import Toolbar from "./Toolbar.vue";
import CustomNode from "./node/CustomNode.vue";
import NewNode from "./node/NewNode.vue";

import type { FlowNode } from "../../../types/flow";
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "@vue-flow/controls/dist/style.css";
import "@vue-flow/minimap/dist/style.css";
import { deepClone } from "@/utils/tools";

const flowStore = useFlowStore();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");
const { project } = useVueFlow();

const selectedNode = ref<FlowNode | null>(null);
const showNodeDetails = ref(false);

const nodeTypes = {
  custom: CustomNode,
  new: NewNode
};

onMounted(() => {
  // flowStore.initializeNodes(initialNodes);
});

const onEdgesChange = (changes: EdgeChange[]) => {
  // flowStore.updateEdges(edges);
};

const onNodeClick = (nodeMouseEvent: NodeMouseEvent) => {
  // selectedNode.value = deepClone(nodeMouseEvent.node);
  // showNodeDetails.value = true;
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "copy";
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();

  const nodeTemplate = event.dataTransfer?.getData("application/flownode");
  if (!nodeTemplate) return;

  try {
    const template = JSON.parse(nodeTemplate);
    const { x, y } = project({ x: event.clientX, y: event.clientY });

    const newNode: FlowNode = {
      id: `${template.id}-${Date.now()}`,
      type: template.type,
      label: template.label,
      position: { x, y },
      data: {
        contentType: template.contentType,
        content: ""
      },
      style:
        template.type === "container"
          ? {
              width: 400,
              height: 300,
              padding: "20px"
            }
          : undefined
    };

    flowStore.addNode(newNode);
  } catch (error) {
    console.error("Failed to create node:", error);
  }
};

const onNodeDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onNodeDrop = (event: DragEvent, targetNode: Node) => {
  event.preventDefault();
  // const sourceNodeId = event.dataTransfer?.getData("application/nodeId");

  // if (sourceNodeId && targetNode.type === "container") {
  //   const sourceNode = flowStore.nodes.find(n => n.id === sourceNodeId);
  //   if (sourceNode && !isCircularDependency(sourceNodeId, targetNode.id)) {
  //     flowStore.setParentNode(sourceNodeId, targetNode.id);
  //   }
  // }
};

const onNodeDragStart = (nodeMouseEvent: NodeMouseEvent) => {
  const event = nodeMouseEvent.event;
  // if (event.dataTransfer) {
  //   event.dataTransfer.setData("application/nodeId", node.id);
  //   event.dataTransfer.effectAllowed = "move";
  // }
};

const isCircularDependency = (sourceId: string, targetId: string): boolean => {
  const checkParents = (
    nodeId: string,
    visited = new Set<string>()
  ): boolean => {
    if (visited.has(nodeId)) return false;
    visited.add(nodeId);

    const node = flowStore.nodes.find(n => n.id === nodeId);
    if (!node) return false;
    if (node.id === sourceId) return true;

    return node.parentNode ? checkParents(node.parentNode, visited) : false;
  };

  return checkParents(targetId);
};

watch(
  () => flowStore.nodes,
  newNodes => {
    console.log("Nodes updated:", newNodes);
  },
  { deep: true }
);
</script>
<!-- :node-types="nodeTypes" -->
<!-- @edges-change="onEdgesChange" -->
<template>
  <div class="flow-node-designer">
    <Toolbar />
    <div class="main-content">
      <div class="">
        <Sidebar />
      </div>
      <VueFlow
        :nodes="flowStore.nodes"
        :edges="flowStore.edges"
        @nodeClick="onNodeClick"
        @nodeDragStart="onNodeDragStart"
        @nodeDragOver="onNodeDragOver"
        @nodeDrop="onNodeDrop"
        @dragover="onDragOver"
        @drop="onDrop"
        class="flow-viewport"
      >
        <Background pattern-color="#aaa" :gap="8" />
        <MiniMap />
        <Panel position="bottom-left">
          <Controls />
        </Panel>
        <template #node-custom="props">
          <CustomNode :id="props.id" :data="props.data" />
        </template>

        <template #node-new="props">
          <NewNode
            :id="props.id"
            :data="props.data"
            :label="props.data.label"
          />
        </template>
      </VueFlow>
      <NodeDetails
        :selected-node="selectedNode"
        v-model:visible="showNodeDetails"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.flow-node-designer {
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .flow-viewport {
    flex: 1;
    height: 100%;
  }
}
</style>
