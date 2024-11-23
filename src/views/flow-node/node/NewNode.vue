<script setup lang="ts">
import { computed } from "vue";
import { Position } from "@vue-flow/core";
import type { FlowNode } from "../../../../types/flow";
import NodeHeader from "./node-parts/NodeHeader.vue";
import NodeContent from "./node-parts/NodeContent.vue";
import NodeFooter from "./node-parts/NodeFooter.vue";

const props = defineProps<{
  id: string;
  data: FlowNode["data"];
}>();
</script>

<template>
  <div :class="['new-node']">
    <div class="node-header">
      {{ data }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.new-node {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0;
  min-width: 180px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  &.container-node {
    min-width: 300px;
    min-height: 200px;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    border: 2px dashed #aaa;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.95);
      border-color: #666;
    }

    &.selected {
      border-color: #409eff;
      background: rgba(255, 255, 255, 0.98);
    }
  }
}
</style>
