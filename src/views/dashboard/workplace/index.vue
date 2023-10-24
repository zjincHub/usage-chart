<template>
  <div class="container">
    <a-checkbox-group v-model:model-value="checkCompanys">
      <a-menu
        :style="{ width: '300px', height: '100%' }"
        :default-open-keys="['0']"
        :default-selected-keys="['0_2']"
        show-collapse-button
        breakpoint="xl"
      >
        <a-menu-item @click="handleChangeAll">
          <template #icon><icon-cloud /></template>
          <div class="menu-item">
            <span>{{ $t('workplace.checkAll') }}</span>
            <a-checkbox disabled value="all" :indeterminate="indeterminate">
            </a-checkbox>
          </div>
        </a-menu-item>

        <a-menu-item
          v-for="item in companys"
          :key="item"
          @click.capture.stop="menuItemClick(item)"
        >
          <template #icon><icon-cloud /></template>
          <a-row>
            <a-col :flex="1">
              <a-typography-paragraph
                :ellipsis="{
                  showTooltip: {
                    type: 'tooltip',
                    props: {
                      style: { maxWidth: `500px` },
                    },
                  },
                  css: false,
                }"
                style="width: 175px; padding-top: 10px"
              >
                <div class="menu-item">
                  <span> {{ item }}</span>
                </div>
              </a-typography-paragraph></a-col
            >
            <a-col :flex="1">
              <a-checkbox disabled :value="item" @click="menuItemClick(item)">
              </a-checkbox></a-col
          ></a-row>
        </a-menu-item>
      </a-menu>
    </a-checkbox-group>
    <a-empty v-if="companys.length === 0" class="empty" />
    <div v-else class="content-box">
      <div class="content-body">
        <a-tabs default-active-key="1" lazy-load>
          <a-tab-pane key="1" :title="$t('workplace.applicationDashboard')">
            <table-data type="1" :companys="checkCompanys" />
          </a-tab-pane>
          <a-tab-pane key="2" :title="$t('workplace.usageQuery')">
            <table-data type="2" :companys="checkCompanys" />
          </a-tab-pane>
          <a-tab-pane key="3" :title="$t('workplace.userStatistics')">
            <table-data type="3" :companys="checkCompanys" />
          </a-tab-pane>
          <a-tab-pane key="4" :title="$t('workplace.featureLog')">
            <table-data type="4" :companys="checkCompanys" />
          </a-tab-pane>
          <a-tab-pane key="5" :title="$t('workplace.usageHistory')">
            <table-data type="5" :companys="checkCompanys" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { cloneDeep } from 'lodash';
  import tableData from './components/table-data.vue';
  import { getCompanys } from './api';

  const companys = ref([]);
  const checkCompanys = ref<string[]>([]);

  // 如果采用气泡的话 需要写自定义指令
  // const tooltipVisible = ref();
  // const isVisible = (item: any) => {
  //   const elements = document.querySelectorAll(item);
  //   console.log(elements.length);
  //   if (elements.length <= 250) {
  //     tooltipVisible.value = false;
  //   } else {
  //     tooltipVisible.value = true;
  //   }
  //   return tooltipVisible;
  // };

  /**
   * 获取公司列表
   */
  const getCompanyList = async () => {
    try {
      const res: any = await getCompanys();
      // 排序
      const otherIndex = res.findIndex((item: string) => item === '其它');
      if (otherIndex !== -1) {
        const other = res.splice(otherIndex, 1);
        res.push(...other);
      }
      companys.value = cloneDeep(res) || [];
      checkCompanys.value = cloneDeep([...res, 'all']) || [];
    } catch {
      companys.value = [];
    }
  };
  getCompanyList();

  /**
   * menu点击事件
   * @param value 公司名称
   */
  const menuItemClick = (value: string) => {
    const index = checkCompanys.value.findIndex((item) => item === value);
    if (index === -1) {
      checkCompanys.value.push(value);
    } else {
      checkCompanys.value.splice(index, 1);
    }
    // 只要checkCompanys中有值，就把'all'放进去
    const allIndex = checkCompanys.value.findIndex((item) => item === 'all');
    if (checkCompanys.value.length > 0 && allIndex === -1) {
      checkCompanys.value.push('all');
    }
    // 如果checkCompanys中只剩下'all'，就把'all'去掉
    if (checkCompanys.value.length === 1 && allIndex !== -1) {
      checkCompanys.value.push('all');
      checkCompanys.value = [];
      return;
    }
    checkCompanys.value = cloneDeep(checkCompanys.value);
  };

  /**
   * 全选点击事件
   */
  const handleChangeAll = () => {
    if (checkCompanys.value.length < companys.value.length + 1) {
      checkCompanys.value = [...cloneDeep(companys.value), 'all'];
    } else {
      checkCompanys.value = [];
    }
  };

  // 控制半选状态
  const indeterminate = ref(false);
  watch(checkCompanys, (value) => {
    if (value.length === 0 || value.length === companys.value.length + 1) {
      indeterminate.value = false;
    } else {
      indeterminate.value = true;
    }
  });
</script>

<style lang="less" scoped>
  .container {
    background-color: var(--color-fill-2);
    display: flex;
    height: calc(100vh - 60px);
    .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
  }

  .content-box {
    background-color: var(--color-fill-2);
    padding: 12px 20px;
    width: 100%;
    overflow: scroll;
  }
  .content-body {
    background-color: var(--color-bg-2);
    border-radius: 4px;
    overflow: auto;
    width: 100%;
    padding: 8px 20px 20px 20px;
  }
  .menu-item {
    width: 210px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  :deep(.arco-checkbox-icon-hover) {
    cursor: pointer !important;
  }
  :deep(.arco-checkbox-checked) {
    .arco-checkbox-icon {
      background-color: rgb(var(--primary-6)) !important;
    }
  }
</style>
