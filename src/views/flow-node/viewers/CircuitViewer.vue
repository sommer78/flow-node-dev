<script setup lang="ts">
import { ref } from "vue";
import { ElUpload, ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";

const props = defineProps<{
  content: string;
  fileType?: string;
}>();

const emit = defineEmits<{
  change: [value: string, fileType: string];
}>();

const acceptedTypes = {
  ".sch": "application/x-eagle-schematic",
  ".brd": "application/x-eagle-board",
  ".kicad_sch": "application/x-kicad-schematic",
  ".kicad_pcb": "application/x-kicad-pcb"
};

const handleFileUpload: UploadProps["beforeUpload"] = file => {
  const extension = "." + file.name.split(".").pop()?.toLowerCase();

  if (!Object.keys(acceptedTypes).includes(extension)) {
    ElMessage.error("不支持的文件类型!");
    return false;
  }

  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target?.result as string;
    emit("change", content, extension);
  };
  reader.readAsDataURL(file);
  return false;
};
</script>

<template>
  <div class="circuit-viewer">
    <div v-if="!content" class="upload-area">
      <el-upload
        class="circuit-uploader"
        :auto-upload="false"
        :show-file-list="false"
        :accept="Object.keys(acceptedTypes).join(',')"
        :before-upload="handleFileUpload"
      >
        <div class="upload-trigger">
          <i class="el-icon-upload" />
          <div class="upload-text">点击或拖拽电路文件到此处</div>
          <div class="supported-types">
            支持的文件类型: Eagle (.sch, .brd), KiCad (.kicad_sch, .kicad_pcb)
          </div>
        </div>
      </el-upload>
    </div>
    <div v-else class="circuit-preview">
      <div class="file-info">
        <span class="file-type">{{ fileType }}</span>
      </div>
      <div class="preview-placeholder">
        <i class="el-icon-document" />
        <span>电路文件已上传</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.circuit-viewer {
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

    .supported-types {
      font-size: 12px;
      color: #909399;
      margin-top: 8px;
    }
  }

  .circuit-preview {
    height: 100%;
    padding: 16px;

    .file-info {
      margin-bottom: 16px;

      .file-type {
        background: #f0f2f5;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
      }
    }

    .preview-placeholder {
      height: calc(100% - 40px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      border-radius: 4px;

      i {
        font-size: 48px;
        color: #909399;
        margin-bottom: 16px;
      }
    }
  }
}
</style>
