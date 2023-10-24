<template>
  <a-modal
    :visible="visible"
    :fullscreen="true"
    :footer="false"
    :title="t('workplace.userList')"
    :unmount-on-close="true"
    @cancel="handleBeforeCancel"
  >
    <a-table
      v-table-height
      row-key="id"
      stripe
      :scroll="scroll"
      :scrollbar="true"
      :pagination="{
        showTotal: true,
        showPageSize: true,
        showJumper: true,
        defaultPageSize: 20,
        pageSizeOptions: [20, 50, 100],
      }"
      :data="dataSource"
      :columns="columns"
      :bordered="false"
      style="padding: 20px"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 + (pagination.current - 1) * pagination.pageSize }}
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { viewUser } from './api';

  const { t } = useI18n();

  const props = withDefaults(
    defineProps<{
      visible: boolean;
    }>(),
    {
      visible: false,
    }
  );

  const emit = defineEmits(['update:visible']);

  const handleBeforeCancel = () => {
    emit('update:visible', false);
  };

  // 表格滚动条
  const scroll = {
    y: 'calc(100vh - 100px)',
  };

  // 分页查询
  const pagination = {
    current: 1,
    pageSize: 20,
    pageSizeOptions: [20, 50, 100],
    showTotal: true,
    showJumper: true,
    showPageSize: true,
  };
  const pageChange = (val: number) => {
    pagination.current = val;
  };
  const pageSizeChange = (val: number) => {
    pagination.pageSize = val;
  };

  // 表格显示列表
  const columns = computed(() => {
    return [
      {
        title: t('workplace.index'), // 序号
        dataIndex: 'index',
        slotName: 'index',
      },
      {
        title: t('adduser.name'), // 姓名
        dataIndex: 'name',
        slotName: 'name',
      },
      {
        title: t('workplace.account'), // 账号
        dataIndex: 'email',
        slotName: 'email',
      },
      {
        title: t('adduser.company'), // 公司
        dataIndex: 'company',
        slotName: 'company',
      },
      {
        title: t('adduser.usertype'), // 用户类型
        dataIndex: 'userType',
        slotName: 'userType',
      },
      {
        title: t('workplace.productName'), // 产品名称
        dataIndex: 'productName',
        slotName: 'productName',
      },

      {
        title: t('workplace.createTime'), // 创建时间
        dataIndex: 'createTime',
        slotName: 'createTime',
      },
      {
        title: t('workplace.endTime'), // 结束时间
        dataIndex: 'endTime',
        slotName: 'endTime',
      },
    ];
  });

  const dataSource = ref<any>([]);
  const tableData = async () => {
    const params = {
      pageIndex: 1,
      pageSize: 9999,
    };
    const res: any = await viewUser(params);
    if (res) {
      console.log(res);
      dataSource.value = res.temp;
    }
  };

  onMounted(tableData);
</script>

<style scoped lang="less"></style>
