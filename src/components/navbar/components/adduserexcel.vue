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
    @before-remove="beforeRemove"
  >
  </a-upload>
  <!-- multiple 是否支持多文件上传 -->
  <!-- file-list 文件列表 -->
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import { Message, Modal, UploadInstance } from '@arco-design/web-vue';
  import {
    userType,
    products,
    ProductsFormInter,
    UserTypeFormInter,
  } from './api';
  import * as XLSX from 'xlsx';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const fileList = ref<FileItem[]>([]);
  const uploadRef = ref<UploadInstance>();
  const lastjsonData: {
    Email: string;
    Name: string;
    Company: string;
    Products: number[];
    UserType: string;
    Days: string;
  }[] = [];

  const beforeUpload = (file: File): boolean => {
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
        const productids: number[] = [];
        jsonData[i][3].split(',').forEach((Item: string) => {
          const product = products.find(
            (item: ProductsFormInter) => item.name === Item
          ) as ProductsFormInter;
          productids.push(product.id);
        });

        const usertype = userType.find(
          (item: UserTypeFormInter) => item.name === jsonData[i][4]
        ) as UserTypeFormInter;
        // console.log(usertype);

        const convertedItem: {
          Email: string;
          Name: string;
          Company: string;
          Products: number[];
          UserType: string;
          Days: string;
        } = {
          Email: jsonData[i][0].toString(),
          Name: jsonData[i][1].toString(),
          Company: jsonData[i][2].toString(),
          Products: productids,
          UserType: usertype.value,
          Days: jsonData[i][5].toString(),
        };
        // console.log(convertedItem);
        lastjsonData.push(convertedItem);
      }
    };
    // console.log(lastjsonData);

    reader.readAsArrayBuffer(file);
    return true;
  };

  // 清除xlsx文件
  const beforeRemove = (fileItem: FileItem): Promise<boolean> => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: t('adduser.importexcel.deletecheck'),
        content: `${t('adduser.importexcel.deletecheck.content')} ${
          fileItem.name
        }`,
        okText: t('adduser.ok'),
        cancelText: t('adduser.cancle'),
        maskClosable: false,
        onOk: () => {
          lastjsonData.length = 0;
          resolve(true);
        },
        onCancel: () => resolve(false),
      });
    });
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
