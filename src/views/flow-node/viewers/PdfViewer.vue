<script setup lang="ts">
import { ref } from "vue";
import { ElUpload, ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";

const props = defineProps<{
  content: string;
}>();

const emit = defineEmits<{
  change: [value: string];
}>();

const handleFileUpload: UploadProps["beforeUpload"] = file => {
  if (file.type !== "application/pdf") {
    ElMessage.error("只能上传PDF文件!");
    return false;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target?.result as string;
    emit("change", content);
  };
  reader.readAsDataURL(file);
  return false;
};
</script>

<template>
  <div class="pdf-viewer">
    <div v-if="!content" class="upload-area">
      <el-upload
        class="pdf-uploader"
        :auto-upload="false"
        :show-file-list="false"
        accept=".pdf"
        :before-upload="handleFileUpload"
      >
        <div class="upload-trigger">
          <i class="el-icon-upload" />
          <div class="upload-text" 点击或拖拽PDF文件到此 />
        </div>
      </el-upload>
    </div>
    <div v-else class="pdf-preview">
      <iframe :src="content" width="100%" height="100%" frameborder="0" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pdf-viewer {
  height: 400px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  .upload-area {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload-trigger {
    text-align: center;
    padding: 20px;
    cursor: pointer;

    &:hover {
      color: #409eff;
    }
  }

  .pdf-preview {
    height: 100%;
  }
}
</style>
