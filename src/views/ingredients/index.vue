<script setup lang="ts">
import { getIngredientsList,addIngredients } from '@/api/ingredients';
import { ref,reactive,nextTick } from 'vue';
import type { Page } from '@/api/types/page';
import type { IngredientsSearchParam,Ingredients } from '@/api/ingredients/types';

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
    食材管理
</template>

<style scoped>

</style>