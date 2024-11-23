<script setup lang="ts">
import { computed } from "vue";
import type { NodeContentType } from "../../../../../types/flow";

const props = defineProps<{
  label: string;
  type: string;
  contentType: NodeContentType;
}>();

const contentTypeLabel = computed(() => {
  switch (props.contentType) {
    case "circuit":
      return "电路图";
    case "pcb":
      return "PCB";
    case "document":
      return "文档";
    case "code":
      return "代码";
    default:
      return props.contentType;
  }
});
</script>

<template>
  <div class="node-header">
    <div class="node-title">{{ label }}</div>
    <div class="node-type">{{ contentTypeLabel }}</div>
  </div>
</template>

<style lang="scss" scoped>
.node-header {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
  border-radius: 8px 8px 0 0;
  background: #f8f9fa;

  .node-title {
    font-weight: 600;
    font-size: 14px;
  }

  .node-type {
    font-size: 12px;
    color: #666;
  }
}
</style>
