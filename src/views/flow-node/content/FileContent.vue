<script setup lang="ts">
import { computed, ref } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { ElUpload, ElIcon } from "element-plus";
import { Document, Upload } from "@element-plus/icons-vue";
import "element-plus/theme-chalk/el-upload.css";

const props = defineProps<{
  content: string;
  isEditing: boolean;
  onUpdate?: (content: string) => void;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");
const fileList = ref([]);

const handleFileUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target?.result as string;
    props.onUpdate?.(content);
  };
  reader.readAsDataURL(file);
  return false;
};

const fileName = computed(() => {
  if (!props.content) return "No file selected";
  try {
    const url = new URL(props.content);
    return url.pathname.split("/").pop() || "Unknown file";
  } catch {
    return "Invalid file";
  }
});
</script>

<template>
  <div class="file-content" :class="isDark ? 'file-dark' : 'file-light'">
    <template v-if="isEditing">
      <ElUpload
        class="file-upload"
        drag
        :auto-upload="false"
        :show-file-list="false"
        @on-change="handleFileUpload"
      >
        <ElIcon class="upload-icon">
          <Upload />
        </ElIcon>
        <div class="upload-text">Drop file here or click to upload</div>
      </ElUpload>
    </template>
    <template v-else>
      <div class="file-info">
        <ElIcon class="file-icon">
          <Document />
        </ElIcon>
        <span class="file-name">{{ fileName }}</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.file-content {
  @apply w-full p-4 rounded-lg border-2 border-dashed;
}

.file-dark {
  @apply bg-gray-700/30 border-gray-600;
}

.file-light {
  @apply bg-gray-100/50 border-gray-300;
}

.file-upload {
  @apply w-full;
}

.upload-icon {
  @apply text-3xl mb-2;
}

.upload-text {
  @apply text-sm;
}

.file-info {
  @apply flex items-center gap-2;
}

.file-icon {
  @apply text-2xl;
}

.file-name {
  @apply text-sm font-medium;
}

:deep(.el-upload-dragger) {
  @apply w-full dark:bg-gray-800 dark:border-gray-600
         dark:hover:border-blue-500;
}
</style>
