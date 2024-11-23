<script setup lang="ts">
import { ref, watch } from "vue";
import { ElInput } from "element-plus";
import MarkdownIt from "markdown-it";

const props = defineProps<{
  modelValue?: string;
  content?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  change: [value: string];
}>();

const md = new MarkdownIt();
const preview = ref("");
const editorContent = ref(props.content || props.modelValue || "");

watch(
  () => props.content || props.modelValue,
  newValue => {
    editorContent.value = newValue || "";
    preview.value = md.render(newValue || "");
  }
);

const handleInput = (value: string) => {
  editorContent.value = value;
  preview.value = md.render(value);
  emit("update:modelValue", value);
  emit("change", value);
};
</script>

<template>
  <div class="markdown-editor">
    <div class="editor-section">
      <el-input
        v-model="editorContent"
        placeholder="输入Markdown内容..."
        type="textarea"
        :rows="10"
        @input="handleInput"
      />
    </div>
    <div class="preview-section">
      <div class="markdown-preview" v-html="preview" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.markdown-editor {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: 400px;

  .editor-section,
  .preview-section {
    height: 100%;
    overflow-y: auto;
  }

  .preview-section {
    padding: 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }

  :deep(.markdown-preview) {
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    p {
      margin: 0.5em 0;
    }

    code {
      background-color: #f6f6f6;
      padding: 2px 4px;
      border-radius: 3px;
    }
  }
}
</style>
