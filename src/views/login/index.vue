<template>
  <div class="container">
    <div class="content">
      <LoginForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .container {
    height: 100vh;
    background-image: url('@/assets/images/login-background.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .content {
      position: relative;
      display: flex;
      align-items: center;
      height: 100%;
      width: 40%;
      background-image: url('@/assets/images/login-side.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding-left: 100px;
    }
  }
</style>
