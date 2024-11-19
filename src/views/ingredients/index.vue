<script setup lang="ts">
import { getIngredientsList, addIngredients } from '@/api/ingredients';
import { ref, reactive, nextTick } from 'vue';
import type { Page } from '@/api/types/page';
import type { IngredientsSearchParam, Ingredients } from '@/api/ingredients/types';

/* 导入组合式函数 */
import { useDict } from '@/util/useDict';

const INGREDIENTS = 'ingredients'

// 使用组合式函数
const { dict,showDictName } = useDict(INGREDIENTS)


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

const listIngredients = (pageNumber = 1) => {
    queryForm.pageNum = pageNumber
    getIngredientsList(queryForm).then((page: Page<Ingredients>) => {
        total.value = page.total
        ingredientsList.value = page.rows
    }).catch(e => {
        console.log(e)
    })
}
/* 重置表单 */
 const resetQueryForm = () => {
    queryFormRef.value.resetFields()
    listIngredients()
}

/* 进入页面立即执行的方法 */
listIngredients()

</script>

<template>
    <div class="app-container">
        <el-form :model="queryForm" ref="queryFormRef" inline>

            <el-form-item label="食材名称" prop="name">
                <el-input placeholder="请输入食材名称" v-model="queryForm.name"></el-input>
            </el-form-item>
            <el-form-item label="食材类型" prop="type">
                <el-select 
                    v-model="queryForm.type" 
                    placeholder="请选择" 
                    clearable 
                    style="width: 180px;">
                    <el-option v-for="item in dict[INGREDIENTS]" :key="item.value" :label="item.name"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="Search" @click="listIngredients()">搜索</el-button>
                <el-button type="info" plain icon="Refresh" @click="resetQueryForm">重置</el-button>
                <el-button type="success" plain icon="Plus">添加</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="ingredientsList" border stripe style="width: 100%;">
            <el-table-column type="index" label="编号" width="80px" align="center"></el-table-column>
            <el-table-column label="食材名称" prop="name" align="center"></el-table-column>
            <el-table-column label="食材类型"  align="center">
                <template #default="scope">
                    <el-tag>{{ showDictName(INGREDIENTS,scope.row.type) }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="食材图片">
                <template #default="{ row }">
                    <el-image :src="base_url + row.url" style="width: 40px; height: 40px;"
                        :preview-src-list="[base_url + row.url]" preview-teleported></el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="300">
                <el-button type="primary" plain icon="Edit">修改</el-button>
                <el-button type="danger" plain icon="Delete">删除</el-button>
            </el-table-column>
        </el-table>
        <el-pagination style="margin-top: 10px           ;" background :total="total" :page-sizes="[1, 5, 10, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper" v-model:page-size="queryForm.pageSize"
            v-model:current-page="queryForm.pageNum" @current-change="listIngredients"
            @size-change="listIngredients()"></el-pagination>
    </div>
</template>

<style scoped></style>