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
          <a-button
            type="primary"
            :loading="btnLoading"
            @click="handleBeforeOk"
            >{{ $t('adduser.ok') }}</a-button
          >
        </a-space>
      </div>
    </template>

    <a-row :gutter="16" style="position: relative" class="row-header">
      <a-col flex="320px">
        <a-radio-group v-model:model-value="defaultOrImportExcel" type="button">
          <a-radio value="default">{{ $t('adduser.default') }}</a-radio>
          <a-radio value="importexcel">{{ $t('adduser.importexcel') }}</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>

    <a-form
      v-if="defaultOrImportExcel === 'default'"
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
            field="Name"
            :label="$t('adduser.name')"
            label-col-flex="76px"
            validate-trigger="input"
            :rules="[
              {
                required: true,
                message: $t('adduser.namerules.message'),
              },
            ]"
          >
            <a-input
              v-model="addUserForm.Name"
              :placeholder="$t('adduser.name.placeholder')"
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
                v-for="product in products"
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
                v-for="usertype in userType"
                :key="`${usertype.value}-${usertype.name}`"
                :value="usertype.value"
                :label="usertype.name"
              ></a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <adduserexcel
      v-if="defaultOrImportExcel === 'importexcel'"
      ref="receivedData"
    />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { AddUserFormInter, addUser, userType, products } from './api';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import adduserexcel from './adduserexcel.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const emit = defineEmits(['update:visible']);

  const btnLoading = ref(false);
  const formRef = ref<FormInstance>();

  const receivedData = ref();

  const addUserForm = reactive<AddUserFormInter>({
    Email: '',
    Name: '',
    Company: '',
    Products: [],
    UserType: '',
  });

  withDefaults(
    defineProps<{
      visible: boolean;
      title: string;
    }>(),
    {
      visible: false,
      title: '',
    }
  );
  const resetModal = ref(false);
  const defaultOrImportExcel = ref<string>('default');

  const handleBeforeCancel = () => {
    emit('update:visible', false);
    resetModal.value = true;
  };

  const handleBeforeOk = async () => {
    btnLoading.value = true;
    const res = await formRef.value?.validate();
    if (!res) {
      const params: any = [
        {
          Email: addUserForm.Email,
          Name: addUserForm.Name,
          Company: addUserForm.Company,
          Products: addUserForm.Products,
          UserType: addUserForm.UserType,
        },
      ];
      // console.log(params);

      if (defaultOrImportExcel.value === 'default') {
        const saveRes = await addUser(params);
        if (saveRes) {
          btnLoading.value = false;
          Message.success(t('adduser.success'));
          handleBeforeCancel();
        } else {
          Message.error(t('adduser.error'));
        }
      } else {
        const Params = receivedData.value.lastjsonData;
        if (Params.length !== 0) {
          const saveRes = await addUser(Params);
          if (saveRes) {
            Message.success(t('adduser.success'));
            btnLoading.value = false;
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
      addUserForm.Name = '';
      addUserForm.Company = '';
      addUserForm.Products = [];
      addUserForm.UserType = '';
      resetModal.value = false;
      defaultOrImportExcel.value = 'default';
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
