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
    const productNames: string[] = [];
    const valueCmdCountData1: number[] = [];
    const valueCmdCountData2: number[] = [];
    const valueCmdCountData3: number[] = [];
    const valueCmdCountData4: number[] = [];
    const valueCmdCountData5: number[] = [];
    const valueCmdCountData6: number[] = [];

    let sumValueCmdCountData1: number;
    let sumValueCmdCountData2: number;
    let sumValueCmdCountData3: number;
    let sumValueCmdCountData4: number;
    let sumValueCmdCountData5: number;
    let sumValueCmdCountData6: number;

    props.data.forEach((item) => {
      productNames.push(item.productName);
    });
    const sumProductNames = Array.from(new Set(productNames));

    // 获取产品名称为 ZJBridge 的总计命令使用量
    const data1 = props.data.filter((item) => {
      return item.productName === 'ZJBridge';
    });
    if (data1.length > 0) {
      for (let i = 0; i < data1.length; i += 1) {
        valueCmdCountData1.push(data1[i].valueCmdCount);
      }
      sumValueCmdCountData1 = valueCmdCountData1.reduce(
        (accumulator, number) => {
          return accumulator + number;
        }
      );
    } else {
      sumValueCmdCountData1 = 0;
    }

    // 获取产品名称为 ZJGeo 的总计命令使用量
    const data2 = props.data.filter((item) => {
      return item.productName === 'ZJGeo';
    });
    if (data2.length > 0) {
      for (let i = 0; i < data2.length; i += 1) {
        valueCmdCountData2.push(data2[i].valueCmdCount);
      }
      sumValueCmdCountData2 = valueCmdCountData2.reduce(
        (accumulator, number) => {
          return accumulator + number;
        }
      );
    } else {
      sumValueCmdCountData2 = 0;
    }

    // 获取产品名称为 ZJTunnel 的总计命令使用量
    const data3 = props.data.filter((item) => {
      return item.productName === 'ZJTunnel';
    });
    if (data3.length > 0) {
      for (let i = 0; i < data3.length; i += 1) {
        valueCmdCountData3.push(data3[i].valueCmdCount);
      }
      sumValueCmdCountData3 = valueCmdCountData3.reduce(
        (accumulator, number) => {
          return accumulator + number;
        }
      );
    } else {
      sumValueCmdCountData3 = 0;
    }

    // 获取产品名称为 ZJLim 的总计命令使用量
    const data4 = props.data.filter((item) => {
      return item.productName === 'ZJLim';
    });
    if (data4.length > 0) {
      for (let i = 0; i < data4.length; i += 1) {
        valueCmdCountData4.push(data4[i].valueCmdCount);
      }
      sumValueCmdCountData4 = valueCmdCountData4.reduce(
        (accumulator, number) => {
          return accumulator + number;
        }
      );
    } else {
      sumValueCmdCountData4 = 0;
    }

    // 获取产品名称为 ZJRoad 的总计命令使用量
    const data5 = props.data.filter((item) => {
      return item.productName === 'ZJRoad';
    });
    if (data5.length > 0) {
      for (let i = 0; i < data5.length; i += 1) {
        valueCmdCountData5.push(data5[i].valueCmdCount);
      }
      sumValueCmdCountData5 = valueCmdCountData5.reduce(
        (accumulator, number) => {
          return accumulator + number;
        }
      );
    } else {
      sumValueCmdCountData5 = 0;
    }

    // 获取产品名称为 CNCCBIM 的总计命令使用量
    const data6 = props.data.filter((item) => {
      return item.productName === 'CNCCBIM';
    });
    if (data6.length > 0) {
      for (let i = 0; i < data6.length; i += 1) {
        valueCmdCountData6.push(data6[i].valueCmdCount);
      }
      sumValueCmdCountData6 = valueCmdCountData6.reduce(
        (accumulator, number) => {
          return accumulator + number;
        }
      );
    } else {
      sumValueCmdCountData6 = 0;
    }

    const useCmdCounts: number[] = [
      sumValueCmdCountData1,
      sumValueCmdCountData2,
      sumValueCmdCountData3,
      sumValueCmdCountData4,
      sumValueCmdCountData5,
      sumValueCmdCountData6,
    ];

    const arr = [sumProductNames, useCmdCounts];
    const options = [];
    for (let i = 1; i < arr.length; i += 1) {
      options.push({
        // 气泡
        tooltip: {},

        // X坐标轴
        xAxis: {
          type: 'category', // 类目轴，适用于离散的类目数据。
          data: arr[0],
          name: t('workplace.productName'), // 坐标轴名称。
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
          name: t('workplace.useCmdCount'),
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
