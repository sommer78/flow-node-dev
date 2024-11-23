<script setup lang="ts">
import { marked } from "marked";
import { computed } from "vue";
import { useThemeStore } from "@/store/modules/theme";

const props = defineProps<{
  content: string;
  isEditing: boolean;
  onUpdate?: (content: string) => void;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");

const renderedContent = computed(() => {
  if (!props.content) return "";
  return marked(props.content);
});
</script>

<template>
  <div class="markdown-content">
    <template v-if="isEditing">
      <ElInput
        placeholder="Enter Markdown content..."
        :value="content"
        type="textarea"
        :rows="5"
        @input="onUpdate?.(content)"
      />
    </template>
    <template v-else>
      <div
        class="markdown-rendered"
        :class="isDark ? 'markdown-dark' : 'markdown-light'"
        v-html="renderedContent"
      />
    </template>
  </div>
</template>

<style scoped>
.markdown-content {
  @apply w-full;
}

.markdown-rendered {
  @apply prose max-w-none p-2 rounded-lg overflow-auto max-h-[200px];
}

.markdown-dark {
  @apply prose-invert bg-gray-700/30;
}

.markdown-light {
  @apply bg-gray-100/50;
}

:deep(pre) {
  @apply p-2 rounded;
}

:deep(code) {
  @apply text-sm;
}

:deep(p) {
  @apply my-2;
}
</style>
