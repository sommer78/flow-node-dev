<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/store/modules/theme";
import { ElUpload, ElIcon, ElImage } from "element-plus";
import { Picture, Upload } from "@element-plus/icons-vue";
import "element-plus/theme-chalk/el-upload.css";
import "element-plus/theme-chalk/el-image.css";

const props = defineProps<{
  content: string;
  isEditing: boolean;
  onUpdate?: (content: string) => void;
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === "dark");

const handleImageUpload = (file: File) => {
  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target?.result as string;
    props.onUpdate?.(content);
  };
  reader.readAsDataURL(file);
  return false;
};
</script>

<template>
  <div class="image-content" :class="isDark ? 'image-dark' : 'image-light'">
    <template v-if="isEditing">
      <ElUpload
        class="image-upload"
        drag
        accept="image/*"
        :auto-upload="false"
        :show-file-list="false"
        @on-change="handleImageUpload"
      >
        <ElIcon class="upload-icon">
          <Upload />
        </ElIcon>
        <div class="upload-text">Drop image here or click to upload</div>
      </ElUpload>
    </template>
    <template v-else>
      <div v-if="content" class="image-preview">
        <ElImage :src="content" fit="contain" :preview-src-list="[content]">
          <template #error>
            <div class="image-error">
              <ElIcon class="error-icon">
                <Picture />
              </ElIcon>
              <span>Failed to load image</span>
            </div>
          </template>
        </ElImage>
      </div>
      <div v-else class="no-image">
        <ElIcon class="placeholder-icon">
          <Picture />
        </ElIcon>
        <span>No image</span>
      </div>
    </template>
  </div>
</template>

<style scoped>
.image-content {
  @apply w-full p-4 rounded-lg border-2 border-dashed;
}

.image-dark {
  @apply bg-gray-700/30 border-gray-600;
}

.image-light {
  @apply bg-gray-100/50 border-gray-300;
}

.image-upload {
  @apply w-full;
}

.upload-icon {
  @apply text-3xl mb-2;
}

.upload-text {
  @apply text-sm;
}

.image-preview {
  @apply w-full flex justify-center;
}

:deep(.el-image) {
  @apply max-h-[200px] rounded-lg overflow-hidden;
}

.image-error,
.no-image {
  @apply flex flex-col items-center gap-2 p-4;
}

.error-icon,
.placeholder-icon {
  @apply text-3xl opacity-50;
}

:deep(.el-upload-dragger) {
  @apply w-full dark:bg-gray-800 dark:border-gray-600
         dark:hover:border-blue-500;
}
</style>
