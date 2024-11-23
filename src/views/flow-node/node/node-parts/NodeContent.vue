<script setup lang="ts">
import { computed } from "vue";
import { Codemirror } from "vue-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import MarkdownPreview from "../../viewers/MarkdownPreview.vue";
import PdfViewer from "../../viewers/PdfViewer.vue";
import CircuitViewer from "../../viewers/CircuitViewer.vue";
import type { NodeContentType, CodeLanguage } from "../../../../../types/flow";

const contentComponent = computed(() => {});

const editorOptions = computed(() => ({
  theme: oneDark,
  extensions: [javascript()],
  tabSize: 2,
  autocompletion: true,
  readonly: true,
  lineNumbers: false,
  lineWrapping: true,
  maxHeight: "100px"
}));
</script>

<template>
  <div class="node-content" />
</template>

<style lang="scss" scoped>
.node-content {
  padding: 12px;
  min-height: 60px;
  max-height: 200px;
  overflow: hidden;

  .container-placeholder {
    color: #adb5bd;
    font-size: 14px;
    text-align: center;
    padding: 20px;
  }

  .empty-content {
    color: #adb5bd;
    font-size: 12px;
    text-align: center;
  }

  .content-viewer {
    font-size: 12px;
    max-height: 150px;
    overflow: hidden;
  }

  :deep(.cm-editor) {
    height: auto;
    max-height: 100px;
    overflow: hidden;
  }
}
</style>
