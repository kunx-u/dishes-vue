<script setup lang="ts">
import {ref, reactive} from 'vue'
import {getCode, login} from '@/api/auth'
import type {CodeResult, LoginParam, Token} from '@/api/auth/types'
import {ElMessage, type FormRules} from 'element-plus'
import {useRoute, useRouter} from 'vue-router'
import {useTokenStore} from '@/stores/useTokenStore'

// Pinia
const tokenStore = useTokenStore()

const route = useRoute()
const router = useRouter()

// 验证码base64
const codeUrl = ref('')

const loginFormRef = ref()

const loginForm = ref<LoginParam>({
  username: '',
  password: '',
  uuid: '',
  code: '',
})

const loginFormRules = ref<FormRules>({
  username: [{required: true, message: '请输入用户名'}],
  password: [{required: true, message: '请输入密码'}],
  code: [{required: true, message: '请输入验证码'}],
})

/* 获取验证码 */
const getVerifyCode = () => {
  getCode().then((resp: CodeResult) => {
    codeUrl.value = resp.codeUrl
    loginForm.value.uuid = resp.uuid
  }).catch(e => {
    console.log(e)
  })
}

/* 登录方法 */
const confirm = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      login(loginForm.value).then((resp: Token) => {
        // 保存token
        tokenStore.setToken(resp)

        ElMessage.success('登录成功！');

        // /login 或者 /login?destPath=/order
        router.push({path: route.query.destPath ? route.query.destPath as string : '/'})
      }).catch(e => {
        console.log(e)
        getVerifyCode()
      })
    }
  })
}

/* 重置登录表单 */
const resetLoginForm = () => {
  loginFormRef.value.resetFields()
  getVerifyCode()
}

/* 进入这个页面直接调用验证码接口 */
getVerifyCode()
</script>

<template>
  <el-card class="login-card">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginFormRules"
      label-width="80">
      <!-- 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名"/>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"/>
      </el-form-item>

      <!-- 验证码 -->
      <el-row :gutter="15">
        <el-col :span="18">
          <el-form-item label="验证码" prop="code">
            <el-input v-model="loginForm.code" placeholder="请输入验证码"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-image :src="codeUrl" @click="getVerifyCode"/>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" plain @click="confirm">登录</el-button>
        <el-button type="info" plain @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<style scoped>
.login-card {
  width: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>