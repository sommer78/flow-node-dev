<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { ElInput, ElSelect, ElOption } from "element-plus";
import "element-plus/theme-chalk/el-select.css";
import "element-plus/theme-chalk/el-option.css";

const props = defineProps<{
  content: string;
  language?: string;
  isEditing: boolean;
  onUpdate?: (content: string, language: string) => void;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "rust",
  "go",
  "html",
  "css",
  "json",
  "yaml",
  "markdown",
  "sql",
  "shell",
  "plaintext"
];

const currentLanguage = computed({
  get: () => props.language || "plaintext",
  set: value => props.onUpdate?.(props.content, value)
});
</script>

<template>
  <div class="code-content">
    <template v-if="isEditing">
      <div class="edit-controls">
        <ElSelect
          v-model="currentLanguage"
          size="small"
          class="language-select"
        >
          <ElOption
            v-for="lang in languages"
            :key="lang"
            :label="lang"
            :value="lang"
          />
        </ElSelect>
      </div>
      <ElInput
        type="textarea"
        placeholder="Enter code..."
        :value="props.content"
        :rows="5"
        @input="onUpdate?.(props.content, currentLanguage)"
      />
    </template>
    <template v-else>
      <pre
        :class="['code-block', isDark ? 'code-dark' : 'code-light']"
      ><code>{{ content }}</code></pre>
    </template>
  </div>
</template>

<style scoped>
.code-content {
  @apply w-full;
}

.edit-controls {
  @apply mb-2;
}

.language-select {
  @apply w-32;
}

.code-block {
  @apply p-2 rounded-lg overflow-auto max-h-[200px] font-mono text-sm;
}

.code-dark {
  @apply bg-gray-700/30 text-gray-100;
}

.code-light {
  @apply bg-gray-100/50 text-gray-800;
}
</style>
