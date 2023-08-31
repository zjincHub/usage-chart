<template>
  <a-modal
    :visible="visible"
    :width="700"
    :title="title"
    :unmount-on-close="true"
    draggable
    @cancel="handleBeforeCancel"
    @before-ok="handleBeforeOk"
  >
    <template #footer>
      <div class="footer">
        <a-link href="/用户模板.xlsx">{{
          $t('adduser.downloadtemplate')
        }}</a-link>
        <a-space>
          <a-button @click="handleBeforeCancel">{{
            $t('adduser.cancle')
          }}</a-button>
          <a-button type="primary" @click="handleBeforeOk">{{
            $t('adduser.ok')
          }}</a-button>
        </a-space>
      </div>
    </template>

    <a-row :gutter="16" style="position: relative" class="row-header">
      <a-col flex="320px">
        <a-radio-group v-model:model-value="DefaultOrImportExcel" type="button">
          <a-radio value="Default">{{ $t('adduser.default') }}</a-radio>
          <a-radio value="ImportExcel">{{ $t('adduser.importexcel') }}</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>

    <a-form
      v-if="DefaultOrImportExcel === 'Default'"
      ref="formRef"
      :model="addUserForm"
    >
      <a-row :gutter="16">
        <a-col flex="320px">
          <a-form-item
            field="Email"
            :label="$t('adduser.email')"
            validate-trigger="input"
            :rules="[
              {
                required: true,
                message: $t('adduser.emailrules.message'),
              },
              {
                match: /[\w.-]+@[\w.-]+\.[\w.-]+/,
                message: $t('adduser.email.incorrectformat'),
              },
            ]"
            label-col-flex="76px"
          >
            <a-input
              v-model="addUserForm.Email"
              :placeholder="$t('adduser.email.placeholder')"
            />
          </a-form-item>
        </a-col>
        <a-col flex="320px">
          <a-form-item
            field="Password"
            :label="$t('adduser.password')"
            label-col-flex="76px"
            validate-trigger="input"
            :rules="[
              {
                required: true,
                message: $t('adduser.passwordrules.message'),
              },
              {
                match: /^[a-zA-Z0-9]+$/, // 匹配英文数字混合
                message: $t('adduser.password.incorrectformat'),
              },
            ]"
          >
            <a-input
              v-model="addUserForm.Password"
              :placeholder="$t('adduser.password.placeholder')"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col flex="320px">
          <a-form-item
            field="Company"
            :label="$t('adduser.company')"
            validate-trigger="input"
            :rules="[
              {
                required: true,
                message: $t('adduser.companyrules.message'),
              },
              {
                match: /[\u4e00-\u9fa5a-zA-Z]+/, // 匹配英文中文混合
                message: $t('adduser.company.incorrectformat'),
              },
            ]"
            label-col-flex="76px"
          >
            <a-input
              v-model="addUserForm.Company"
              :placeholder="$t('adduser.company.placeholder')"
            />
          </a-form-item>
        </a-col>

        <a-col flex="320px">
          <a-form-item
            field="Products"
            :label="$t('adduser.products')"
            label-col-flex="76px"
            :rules="[
              {
                required: true,
                message: $t('adduser.productsrules.message'),
              },
            ]"
          >
            <a-select
              v-model="addUserForm.Products"
              :placeholder="$t('adduser.products.placeholder')"
              allow-clear
              allow-search
              multiple
            >
              <a-option
                v-for="product in Products"
                :key="`${product.id}-${product.name}`"
                :value="product.id"
                :label="product.name"
              ></a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="16">
        <a-col flex="320px">
          <a-form-item
            field="UserType"
            :label="$t('adduser.usertype')"
            label-col-flex="76px"
            :rules="[
              {
                required: true,
                message: $t('adduser.usertyperules.message'),
              },
            ]"
          >
            <a-select
              v-model="addUserForm.UserType"
              :placeholder="$t('adduser.usertype.placeholder')"
              allow-clear
              allow-search
            >
              <a-option
                v-for="usertype in UserType"
                :key="`${usertype.value}-${usertype.name}`"
                :value="usertype.value"
                :label="usertype.name"
              ></a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <adduserexcel v-if="DefaultOrImportExcel === 'ImportExcel'" ref="DATA" />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { addUserFormInter, addUser, UserType, Products } from './api';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import adduserexcel from './adduserexcel.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const emit = defineEmits(['update:visible']);

  const formRef = ref<FormInstance>();

  const DATA = ref();

  const addUserForm = reactive<addUserFormInter>({
    Email: '',
    Password: '',
    Company: '',
    Products: [],
    UserType: '',
  });

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  });

  const resetModal = ref(false);
  const DefaultOrImportExcel = ref<string>('Default');

  const handleBeforeCancel = () => {
    emit('update:visible', false);
    resetModal.value = true;
  };

  const handleBeforeOk = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      const params: any = [
        {
          Email: addUserForm.Email,
          Password: addUserForm.Password,
          Company: addUserForm.Company,
          Products: addUserForm.Products,
          UserType: addUserForm.UserType,
        },
      ];
      // console.log(params);

      if (DefaultOrImportExcel.value === 'Default') {
        const saveRes = await addUser(params);
        if (saveRes) {
          Message.success(t('adduser.success'));
          handleBeforeCancel();
        } else {
          Message.error(t('adduser.error'));
        }
      } else {
        const Params = DATA.value.lastjsonData;
        if (Params.length !== 0) {
          const saveRes = await addUser(Params);
          if (saveRes) {
            Message.success(t('adduser.success'));
            handleBeforeCancel();
          } else {
            Message.error(t('adduser.error'));
          }
        } else {
          Message.error(t('adduser.unimportexcel'));
        }
      }
    }
  };
  watch(
    () => resetModal.value === true,
    () => {
      addUserForm.Email = '';
      addUserForm.Password = '';
      addUserForm.Company = '';
      addUserForm.Products = [];
      addUserForm.UserType = '';
      resetModal.value = false;
      DefaultOrImportExcel.value = 'Default';
    }
  );
</script>

<style scoped lang="less">
  .row-header {
    top: -12px;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
