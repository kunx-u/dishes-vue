<script setup lang="ts">
import { getIngredientsList, addIngredients } from '@/api/ingredients';
import { ref, reactive, nextTick } from 'vue';
import type { Page } from '@/api/types/page';
import type { IngredientsSearchParam, Ingredients } from '@/api/ingredients/types';


const base_url = import.meta.env.VITE_APP_BASE_API

/* 查询表单 */
const queryFormRef = ref()
const queryForm = reactive<IngredientsSearchParam>({
    pageNum: 1,
    pageSize: 1,
    name: '',
    type: ''
})

/* 食材列表数据 */

const total = ref(0)
const ingredientsList = ref<Ingredients[]>([])

const listIngredients = () => {
    getIngredientsList(queryForm).then((page: Page<Ingredients>) => {
        total.value = page.total
        ingredientsList.value = page.rows
    }).catch(e => {
        console.log(e)
    })
}


/* 进入页面立即执行的方法 */
listIngredients()

</script>

<template>
    <el-form :model="queryForm" ref="queryFormRef" inline>

        <el-form-item label="食材名称" prop="name">
            <el-input placeholder="请输入食材名称" v-model="queryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="食材类型" prop="type">

        </el-form-item>
        <el-form-item>
            <el-button type="primary" plain icon="Search">搜索</el-button>
            <el-button type="info" plain icon="Refresh">重置</el-button>
            <el-button type="success" plain icon="Plus">添加</el-button>
        </el-form-item>
    </el-form>
    <el-table 
        :data="ingredientsList"
        border
        stripe
        style="width: 100%;">
        <el-table-column type="index" label="编号" width="80px" align="center"></el-table-column>
        <el-table-column label="食材名称" prop="name" align="center"></el-table-column>
        <el-table-column label="食材类型" prop="type" align="center"></el-table-column>
        <el-table-column label="食材图片">
            <template #default="{row}">
                <el-image :src="base_url + row.url"
                    style="width: 40px; height: 40px;"></el-image>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped></style>