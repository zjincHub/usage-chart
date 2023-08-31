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

      // 创建一个空数组来存储第四、第五个数据
      const fourthDataArray: any[] = [];
      const fiveDataArray: any[] = [];

      const productIds: any[] = [];
      const usertypevalue: any[] = [];

      // 从第二个数组开始遍历嵌套数组 获取当前数组的第四、第五个数据，并将其存入新数组
      for (let i = 1; i < jsonData.length; i++) {
        const fourthData = jsonData[i][3];
        const fiveData = jsonData[i][4];
        fourthDataArray.push(fourthData);
        fiveDataArray.push(fiveData);
      }

      for (let i = 0; i < fourthDataArray.length; i++) {
        const usertype = UserType.find(
          (item) => item.name === fiveDataArray[i]
        );
        usertypevalue.push(usertype?.value);
        // console.log(usertypevalue);

        if (fourthDataArray[i].split(',').length < 2) {
          const product = Products.find(
            (item) => item.name === fourthDataArray[i]
          );
          productIds.push([product?.id]);
          // console.log(productId);
        } else {
          const productId: any[] = [];
          fourthDataArray[i].split(',').forEach((item: any) => {
            const product = Products.find((Item) => Item.name === item);
            productId.push(product?.id);
          });
          productIds.push(productId);
        }
      }
      // console.log(productIds);

      for (let i = 1; i < jsonData.length; i++) {
        jsonData[i][3] = productIds[i - 1];
        jsonData[i][4] = usertypevalue[i - 1];
      }
      jsonData.splice(0, 1);
      // console.log(jsonData);

      for (let i = 0; i < jsonData.length; i++) {
        const jsonDataitem = jsonData[i];
        const convertedItem = {
          Email: jsonDataitem[0].toString(),
          Password: jsonDataitem[1].toString(),
          Company: jsonDataitem[2].toString(),
          Products: jsonDataitem[3],
          UserType: jsonDataitem[4],
        };
        lastjsonData.push(convertedItem);
      }
      // 最终符合上传格式要求的数据
      console.log(lastjsonData);

      // const jsonString = JSON.stringify(jsonData); // 将 jsonData(数组/json对象) 转换为字符串
      // const jsonObject = JSON.parse(jsonString); // 将字符串 jsonString 转换为 json 对象
      // console.log(jsonString); // 输出转换后的JSON对象
    };
    // console.log(lastjsonData);

    reader.readAsArrayBuffer(file);
    // console.log(file);
    return true;
  };

  // 清除xlsx文件
  const removeFile = (fileItem: FileItem) => {
    fileList.value = fileList.value.filter((item) => item.uid !== fileItem.uid);
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
