<template>
  <div class="charts">
    <a-card
      v-for="(item, index) in optionArray"
      :key="index"
      class="chart-box"
      :title="titles[index]"
    >
      <Chart height="100%" width="100%" :option="item" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { UseageBrowseData } from '../api';

  const props = defineProps<{ data: UseageBrowseData[] }>();

  const { t } = useI18n();
  const titles = [
    t('workplace.sumOfNode'),
    t('workplace.maxOfNode'),
    t('workplace.serviceTime'),
    t('workplace.macAdd'),
  ];

  const optionArray = computed(() => {
    const productNames: string[] = [];
    const macAdds: number[] = [];
    const maxOfNodes: number[] = [];
    const sumOfNodes: number[] = [];
    const useCmdCounts: number[] = [];
    props.data.forEach((item) => {
      productNames.push(item.productName);
      macAdds.push(item.macAdd);
      maxOfNodes.push(item.maxOfNode);
      sumOfNodes.push(item.sumOfNode);
      useCmdCounts.push(item.useCmdCount);
    });
    const arr = [productNames, sumOfNodes, maxOfNodes, useCmdCounts, macAdds];
    const options = [];
    for (let i = 1; i < arr.length; i += 1) {
      options.push({
        xAxis: {
          type: 'category',
          data: arr[0],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: arr[i],
            type: 'bar',
          },
        ],
      });
    }
    return options;
  });
</script>

<style lang="less" scoped>
  .charts {
    display: flex;
    flex-wrap: wrap;
    .chart-box {
      width: 50%;
      height: 300px;
      border: 0;
      margin: 20px 0;
      :deep(.arco-card-body) {
        height: 100%;
        padding: 0;
      }
      :deep(.arco-card-header) {
        border: 0;
      }
    }
  }
</style>
