<script setup lang="ts">
import { computed } from "vue";
import { Position } from "@vue-flow/core";
import { ElSwitch, ElTooltip } from "element-plus";
import { useFlowStore } from "@/store/modules/flow";
import type { NodeStatus } from "../../../../../types/flow";

const props = defineProps<{
  id: string;
  inputs?: Array<{
    id: string;
    label: string;
    position: Position;
  }>;
  outputs?: Array<{
    id: string;
    label: string;
    position: Position;
  }>;
  status?: NodeStatus;
  createdAt?: number;
  updatedAt?: number;
  relationValue?: number;
}>();

const flowStore = useFlowStore();

const statusColor = computed(() => {
  switch (props.status) {
    case "active":
      return "#67C23A";
    case "inactive":
      return "#909399";
    case "processing":
      return "#409EFF";
    case "error":
      return "#F56C6C";
    default:
      return "#909399";
  }
});

const formattedTime = (timestamp?: number) => {
  if (!timestamp) return "未设置";
  return new Date(timestamp).toLocaleString();
};

const handleStatusChange = (value: boolean) => {
  // flowStore.updateNode(props.id, {
  //   data: {
  //     status: value ? "active" : "inactive",
  //     updatedAt: Date.now()
  //   }
  // });
};

const relationValueLabel = computed(() => {
  if (typeof props.relationValue !== "number") return "未设置";
  return `${props.relationValue.toFixed(2)}%`;
});
</script>

<template>
  <div class="node-footer">
    <!-- Status and Metadata Section -->
    <div class="metadata-section">
      <div class="status-row">
        <ElTooltip
          :content="status ? '当前状态: ' + status : '状态未设置'"
          placement="top"
        >
          <div class="status-indicator">
            <ElSwitch
              @change="handleStatusChange"
              :active-color="statusColor"
            />
          </div>
        </ElTooltip>
      </div>

      <div class="time-row">
        <ElTooltip
          :content="`创建时间: ${formattedTime(createdAt)}\n更新时间: ${formattedTime(updatedAt)}`"
          placement="top"
        >
          <span class="time-info">
            <i class="el-icon-time" />
            {{ updatedAt ? "最后更新: " + formattedTime(updatedAt) : "未更新" }}
          </span>
        </ElTooltip>
      </div>

      <div class="relation-row" v-if="relationValue !== undefined">
        <ElTooltip content="节点关系值" placement="top">
          <span class="relation-value"> 关系值: {{ relationValueLabel }} </span>
        </ElTooltip>
      </div>
    </div>

    <!-- Handles Section -->
    <div class="handles-section">
      <!-- Input Handlers -->
      <template v-if="inputs">
        <div
          v-for="input in inputs"
          :key="input.id"
          :class="['input-handle', `position-${input.position}`]"
          data-handleid="target"
          :data-handlepos="input.position"
        >
          {{ input.label }}
        </div>
      </template>

      <!-- Output Handlers -->
      <template v-if="outputs">
        <div
          v-for="output in outputs"
          :key="output.id"
          :class="['output-handle', `position-${output.position}`]"
          data-handleid="source"
          :data-handlepos="output.position"
        >
          {{ output.label }}
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.node-footer {
  position: relative;
  padding: 8px 12px;
  border-top: 1px solid #eee;

  .metadata-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;

    .status-row,
    .time-row,
    .relation-row {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #606266;
    }

    .time-info,
    .relation-value {
      cursor: default;

      i {
        margin-right: 4px;
      }
    }

    .relation-value {
      padding: 2px 6px;
      background: #f0f2f5;
      border-radius: 4px;
      font-size: 11px;
    }
  }

  .handles-section {
    position: relative;
    min-height: 20px;

    .input-handle,
    .output-handle {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #6c757d;
      border: 2px solid white;
      border-radius: 50%;
      cursor: crosshair;
      font-size: 10px;
      color: white;
      display: flex;
      align-items: center;

      &.position-left {
        left: -6px;
        top: 50%;
        transform: translateY(-50%);
      }

      &.position-right {
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
      }

      &.position-top {
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
      }

      &.position-bottom {
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .input-handle {
      background: #20c997;
    }

    .output-handle {
      background: #fd7e14;
    }
  }
}
</style>
