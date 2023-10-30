<template>
  <div class="charts">
    <a-card v-for="(item, index) in optionArray" :key="index" class="chart-box">
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

  const optionArray = computed(() => {
    const userName: string[] = [];
    const cmdCount: number[] = [];
    props.data.forEach((item) => {
      userName.push(item.userName);
      cmdCount.push(item.cmdCount);
    });
    const arr = [userName, cmdCount];
    const options = [];
    for (let i = 1; i < arr.length; i += 1) {
      options.push({
        // 气泡
        tooltip: {},

        // X坐标轴
        xAxis: {
          type: 'category', // 类目轴，适用于离散的类目数据。
          data: arr[0],
          name: t('workplace.userName'), // 坐标轴名称。
          // 坐标轴刻度相关设置。
          axisTick: {
            show: true, // 是否显示坐标轴刻度。
            interval: 0, // 设置成 0 强制显示所有刻度。如果设置为 1，表示『隔一个刻度显示一个刻度』，如果值为 2，表示隔两个刻度显示一个刻度，以此类推。
          },
          // 坐标轴刻度标签的相关设置。
          axisLabel: {
            formatter: '{value}', // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
            align: 'center', // 文字水平对齐方式，默认自动。
            fontSize: 15, // 文字的字体大小。
            width: 100, // 文本显示宽度。
            overflow: 'breakAll', // 文字超出宽度是否截断或者换行。配置width时有效
            interval: 0, // 设置成 0 强制显示所有标签。如果设置为 1，表示『隔一个标签显示一个标签』，如果值为 2，表示隔两个标签显示一个标签，以此类推。
          },
          // 坐标轴名称的文字样式。
          nameTextStyle: {
            fontStyle: 'italic', // 文字字体的风格。
            fontWeight: 'normal', // 文字字体的粗细。
            fontFamily: 'serif', // 文字的字体系列。
            fontSize: 20, // 文字的字体大小。
            verticalAlign: 'top', // 文字垂直对齐方式，默认自动。
            padding: [4, 4, 4, 4], // 文字块的内边距。
            overflow: 'breakAll', // 文字超出宽度是否截断或者换行。配置width时有效
          },
        },

        // Y坐标轴
        yAxis: {
          type: 'value',
          data: arr[1],
          name: t('workplace.cmdCount'),
          // 坐标轴刻度标签的相关设置。
          axisLabel: {
            formatter: '{value}',
            align: 'center',
            fontSize: 15, // 文字的字体大小。
          },
          // 坐标轴名称的文字样式。
          nameTextStyle: {
            fontStyle: 'italic', // 文字字体的风格。
            fontWeight: 'normal', // 文字字体的粗细。
            fontFamily: 'serif', // 文字的字体系列。
            fontSize: 20, // 文字的字体大小。
            verticalAlign: 'top', // 文字垂直对齐方式，默认自动。
            padding: [-30, 80, 0, 0], // 文字块的内边距。
            overflow: 'breakAll', // 文字超出宽度是否截断或者换行。配置width时有效
          },
        },
        series: [
          {
            data: arr[i],
            type: 'bar',
          },
        ],
      });
    }
    console.log(options);
    return options;
  });
</script>

<style lang="less" scoped>
  .charts {
    display: flex;
    flex-wrap: wrap;
    .chart-box {
      width: 100%;
      height: 500px;
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
