<script setup lang="ts">
import { getCode, login } from '@/api/auth';
import { ref, reactive } from 'vue';
import type { CodeResult, LoginParam, Token } from '@/api/auth/types';
import { ElMessage, type FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { userTokenStore } from '@/stores/useTokenStore';

const tokenStore = userTokenStore()

const route = useRoute()
const router = useRouter()


const codeUrl = ref('')

const loginFormRef = ref()
const loginForm = ref<LoginParam>({
    username: '',
    password: '',
    uuid: '',
    code: '',
})

const loginFormRules = ref<FormRules>({
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: true, message: '请输入密码' }],
    code: [{ required: true, message: '请输入验证码' }],
})

const getVerifyCode = () => {
    getCode().then((resp: CodeResult) => {
        codeUrl.value = resp.codeUrl
        loginForm.value.uuid = resp.uuid
    }).catch(e => {
        console.log(e)
    })
}


const confirm = () => {
    loginFormRef.value.validate((valid: boolean) => {
        if (valid) {
            login(loginForm.value).then((resp: Token) => {
                tokenStore.setToken(resp)
                ElMessage.success('登录成功!')
                router.push({path: route.query.destPath ? route.query.destPath as string : '/'})
            }).catch(e => {
                console.log(e)
                getVerifyCode()
            })
        }
    })
}

/** 重置登录表单 */
const resetLoginForm = () => {
    loginFormRef.value.resetFields()
    getVerifyCode()
}

/** 进入这个页面直接调用验证码接口 */
getVerifyCode()


</script>

<template>
    <el-card class="login-card">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="80">
            <el-form-item label="用户名" prop="username">
                <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" placeholder="请输入密码" v-model="loginForm.password"></el-input>
            </el-form-item>

            <el-row :gutter="15">
                <el-col :span="18">
                    <el-form-item label="验证码" prop="code">
                        <el-input placeholder="请输入验证码" v-model="loginForm.code"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-image :src="codeUrl" @click="getVerifyCode"></el-image>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" @click="confirm" plain>登录</el-button>
                <el-button type="info" @click="resetLoginForm" plain>重置</el-button>
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