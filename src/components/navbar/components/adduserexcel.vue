<template>
  <a-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    action="/api/api/UserAdd"
    :auto-upload="false"
    :limit="1"
    draggable
    show-file-list
    list-type="text"
    :tip="$t('adduser.importexcel.tip')"
    :show-link="true"
    @before-upload="beforeUpload"
  >
    <template #upload-item="{ fileItem }">
      <div :key="fileItem.uid" class="arco-upload-list-item">
        <div class="arco-upload-list-item-content">
          <span class="arco-upload-list-item-thumbnail">
            <IconFile />
          </span>
          <div class="arco-upload-list-item-name">
            <div class="arco-upload-list-item-name-text">{{
              fileItem.name
            }}</div>
          </div>
        </div>
        <span
          class="arco-upload-list-item-operation"
          @click="removeFile(fileItem)"
        >
          <span class="arco-icon-hover">
            <span class="arco-upload-icon arco-upload-icon-remove">
              <IconClose />
            </span>
          </span>
        </span>
      </div>
    </template>
  </a-upload>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import { IconFile, IconClose } from '@arco-design/web-vue/es/icon';
  import { Message, UploadInstance } from '@arco-design/web-vue';
  import { UserType, Products } from './api';
  import * as XLSX from 'xlsx';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const fileList = ref<FileItem[]>([]);
  const uploadRef = ref<UploadInstance>();
  const lastjsonData: {
    Email: any;
    Password: any;
    Company: any;
    Products: any;
    UserType: any;
  }[] = [];

  const beforeUpload = (file: File): boolean | Promise<boolean | File> => {
    if (
      [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ].indexOf(file.type) === -1 // 判断文件是否为xlsx的文件
    ) {
      Message.error(t('adduser.importexcel.format'));
      return false;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // 获取第一个工作表的数据
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: Array<any> = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
      });
      // console.log(jsonData); // 输出转换后的JSON对象

      for (let i = 1; i < jsonData.length; i++) {
        const productids: any[] = [];
        jsonData[i][3].split(',').forEach((Item: string) => {
          const product = Products.find((item) => item.name === Item);
          productids.push(product?.id);
        });

        const usertype = UserType.find((item) => item.name === jsonData[i][4]);

        const convertedItem = {
          Email: jsonData[i][0].toString(),
          Password: jsonData[i][1].toString(),
          Company: jsonData[i][2].toString(),
          Products: productids,
          UserType: usertype?.value,
        };
        console.log(convertedItem);
        lastjsonData.push(convertedItem);
      }
    };
    // console.log(lastjsonData);

    reader.readAsArrayBuffer(file);
    return true;
  };

  // 清除xlsx文件
  const removeFile = (fileItem: FileItem) => {
    fileList.value = fileList.value.filter((item) => item.uid !== fileItem.uid);
    // console.log(fileItem);
  };

  defineExpose({
    lastjsonData,
  });
</script>

<style lang="less" scoped>
  .arco-upload-list-item-thumbnail {
    width: 16px;
    height: 16px;
    font-size: 16px;
    line-height: 1; // 行间距
  }

  span {
    color: var(--color-text-2);
  }

  button {
    border-radius: var(--border-radius-medium);
  }
</style>
