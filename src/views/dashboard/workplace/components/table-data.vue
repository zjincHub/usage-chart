<template>
  <div class="table-data">
    <a-row>
      <a-col flex="auto">
        <a-range-picker v-model:model-value="formData.pickDate" />
        <a-select
          v-if="['2', '3', '4'].includes(props.type)"
          v-model="formData.productName"
          :style="{ width: '200px', marginLeft: '12px' }"
          placeholder="产品名称"
        >
          <a-option v-for="item in products" :key="item.name">{{
            item.name
          }}</a-option>
          <a-option>Disabled</a-option>
        </a-select>
        <a-select
          v-if="['2'].includes(props.type)"
          v-model="formData.timeSelect"
          :style="{ width: '200px', marginLeft: '12px' }"
          placeholder="显示单元"
        >
          <a-option value="2">{{ $t('workplace.day') }}</a-option>
          <a-option value="1">{{ $t('workplace.month') }}</a-option>
          <a-option value="0">{{ $t('workplace.year') }}</a-option>
        </a-select>
        <a-select
          v-if="['2'].includes(props.type)"
          v-model="formData.statistics"
          :style="{ width: '200px', marginLeft: '12px' }"
          placeholder="统计方式"
        >
          <a-option value="Sum">{{ $t('workplace.sum') }}</a-option>
          <a-option value="Max">{{ $t('workplace.maximum') }}</a-option>
          <a-option value="Average">{{ $t('workplace.average') }}</a-option>
        </a-select>
      </a-col>
      <a-col flex="120px">
        <a-radio-group v-model:model-value="tableOrChart" type="button">
          <a-radio value="table">{{ $t('workplace.table') }}</a-radio>
          <a-radio value="chart">{{ $t('workplace.chart') }}</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-table
      v-if="tableOrChart === 'table'"
      class="table"
      :columns="tableColumn"
      :data="data"
      :pagination="pagination"
      @page-change="pageChange"
      @page-size-change="pageSizeChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #sumOfNodeTitle="{ column }">
        <span :style="{ marginRight: '8px' }">{{ column.title }}</span>
        <a-tooltip :content="$t('workplace.sumOfNodeTitle')">
          <icon-question-circle-fill />
        </a-tooltip>
      </template>
      <template #maxOfNodeTitle="{ column }">
        <span :style="{ marginRight: '8px' }">{{ column.title }}</span>
        <a-tooltip :content="$t('workplace.maxOfNodeTitle')">
          <icon-question-circle-fill />
        </a-tooltip>
      </template>
      <template #useCmdCountTitle="{ column }">
        <span :style="{ marginRight: '8px' }">{{ column.title }}</span>
        <a-tooltip :content="$t('workplace.useCmdCountTitle')">
          <icon-question-circle-fill />
        </a-tooltip>
      </template>
      <template #macAddTitle="{ column }">
        <span :style="{ marginRight: '8px' }">{{ column.title }}</span>
        <a-tooltip :content="$t('workplace.macAddTitle')">
          <icon-question-circle-fill />
        </a-tooltip>
      </template>
    </a-table>
    <div v-else-if="props.type === '1'">
      <chart1 :data="data" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, toRefs, Ref, reactive, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import dayjs from 'dayjs';
  import { TableColumnData } from '@arco-design/web-vue';
  import chart1 from './chart-type1.vue';
  import {
    getColumns1,
    getColumns2,
    getColumns3,
    getColumns4,
  } from '../ts/table-column';
  import {
    useageBrowse,
    usageQuery,
    userStatistics,
    featureLog,
    UseageParams,
    getProduct,
    Product,
  } from '../api';

  const props = defineProps<{ type: string; companys: string[] }>();
  const propsRef = toRefs(props);

  const { t } = useI18n();

  const formData = reactive({
    pickDate: [
      dayjs(new Date().getTime() - 2592000000).format('YYYY-MM-DD HH:mm:ss'),
      dayjs().format('YYYY-MM-DD'),
    ],
    productName: '',
    timeSelect: '2',
    statistics: 'Sum',
  });

  const pagination = reactive({
    showTotal: true,
    total: 0,
    showPageSize: true,
    pageSize: 15,
    current: 1,
  });

  const tableOrChart = ref<string>('table');

  const products = ref<Product[]>([]);
  /**
   * 获取产品下拉列表
   */
  const getProducts = async () => {
    try {
      const res: any = await getProduct();
      products.value = res || [];
      if (products.value.length) formData.productName = products.value[0].name;
    } catch {
      products.value = [];
    }
  };
  if (['2', '3', '4'].includes(propsRef.type.value)) getProducts();

  /**
   * 获取列数据
   * @param type
   */
  const getColumns = (type: string) => {
    let result: Ref<TableColumnData[]>;
    if (type === '1') {
      result = computed(() => getColumns1(t));
    } else if (type === '2') {
      result = computed(() => getColumns2(t));
    } else if (type === '3') {
      result = computed(() => getColumns3(t));
    } else {
      result = computed(() => getColumns4(t));
    }
    return result;
  };
  const tableColumn = getColumns(propsRef.type.value);

  const data: any = ref([]);
  /**
   * 获取表格数据
   */
  const getData = async (type: string) => {
    let api;
    const params: UseageParams = {
      Companys: propsRef.companys.value.filter((item) => item !== 'all'),
      StartTime: formData.pickDate[0],
      EndTime: formData.pickDate[1],
      Statistics: formData.statistics,
      TimeSelect: formData.timeSelect,
      ProductName: formData.productName,
      PageIndex: pagination.current,
      PageSize: pagination.pageSize,
      Entity: '',
    };
    if (type === '1') {
      api = useageBrowse;
    } else if (type === '2') {
      api = usageQuery;
    } else if (type === '3') {
      api = userStatistics;
    } else {
      api = featureLog;
    }
    try {
      const res: any = await api(params);
      if (Array.isArray(res)) {
        data.value = res;
        pagination.total = res.length;
      } else if (res.constructor === Object) {
        data.value = res.temp || [];
        pagination.total = res.total;
      } else {
        data.value = [];
        pagination.total = 0;
      }
    } catch {
      data.value = [];
      pagination.total = 0;
    }
  };

  // 2，3，4类型的表需要先获取产品，再获取表格数据
  if (!['2', '3', '4'].includes(propsRef.type.value)) {
    getData(propsRef.type.value);
  }

  // 2，3，4类型的表后端分页
  const pageChange = (val: number) => {
    pagination.current = val;
    if (['2', '3', '4'].includes(propsRef.type.value)) {
      getData(propsRef.type.value);
    }
  };
  const pageSizeChange = (val: number) => {
    pagination.pageSize = val;
    if (['2', '3', '4'].includes(propsRef.type.value)) {
      getData(propsRef.type.value);
    }
  };
  watch(formData, () => {
    getData(propsRef.type.value);
  });
  watch(propsRef.companys, () => {
    getData(propsRef.type.value);
  });
</script>

<style lang="less" scoped>
  .table-data {
    padding: 0 12px;
    .table {
      margin-top: 12px;
    }
  }
</style>
