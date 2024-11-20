<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import type { Page } from '@/api/types/page';
import type { Dishes, DishesSearchParam } from '@/api/dishes/types';
import { getDishesList, addDishes, updateDishes, deleteDishes } from '@/api/dishes';
import { deleteIngredients, listByType } from '@/api/ingredients';
import { ElMessage, ElMessageBox, type FormRules, type UploadProps, type UploadUserFile } from 'element-plus';
import type { Ingredients } from '@/api/ingredients/types';


const base_url = import.meta.env.VITE_APP_BASE_API

/***** 列表 ******/
const pageNum = ref(1)
const pageSize = ref(1)
const total = ref(0)
const dishesList = ref<Dishes[]>([])


const queryFormRef = ref()
const queryForm = ref<DishesSearchParam>({
    name: ''
})

const listDishes = (pageNumber = 1) => {
    pageNum.value = pageNumber
    getDishesList(pageNum.value, pageSize.value, queryForm.value).then((page: Page<Dishes>) => {
        total.value = page.total
        dishesList.value = page.rows
    }).catch(e => {
        console.log(e)
    })
}
/************* 重置查询表单 *************/
const resetQuerForm = () => {
    queryFormRef.value.resetFields()
    listDishes()
}

/*********** 添加 *************/
const dishesFormTitle = ref('添加菜品')
const dishesFormVisible = ref(false)

const dishesFormRef = ref()
const dishesForm = ref<Dishes>({
    name: '',
    url: '',
    main: '',
    mainNum: 10,
    minor: '',
    minorNum: 10,
    seasoning: '',
    seasoningNum: 10,
    description: '',
})

const dishesFormRules = ref<FormRules>({
    name: [{ required: true, message: '请输入菜品名称' }],
    url: [{ required: true, message: '请上传图片' }],
    main: [{ required: true, message: '请选择' }],
    mainNum: [{ required: true, message: '请填写份量' }],
    minor: [{ required: true, message: '请选择' }],
    minorNum: [{ required: true, message: '请填写份量' }],
    seasoning: [{ required: true, message: '请选择' }],
    seasoningNum: [{ required: true, message: '请填写份量' }],
    description: [{ required: true, message: '请输入菜品描述' }],
})


const fileList = ref<UploadUserFile[]>([])
const fileLimit = ref(1)

const handleOnSuccess: UploadProps['onSuccess'] = (resp, file, files) => {
    dishesForm.value.url = resp.data
    dishesFormRef.value.validateField('url')
}

const handleOnRemove: UploadProps['onRemove'] = () => {
    dishesForm.value.url = ''
    fileList.value = []
    dishesFormRef.value.validateField('url')
}

const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'

    const isLt1MB = file.size / 1024 / 1024 < 1

    if (!isJPG && !isPNG) {
        ElMessage.warning('仅支持jpeg/png格式')
        return false
    }

    if (!isLt1MB) {
        ElMessage.warning('大小不能超过1MB')
        return false
    }

}

const handleOnExceed: UploadProps['onExceed'] = (files, uploadFile) => {
    ElMessage.warning('不能超过' + fileLimit.value + '张图片')
}
/* 点击添加按钮 */
const handleAdd = () => {
    dishesFormVisible.value = true
    nextTick(() => {
        dishesFormTitle.value = '编辑菜品信息'
        dishesForm.value = {
            name: '',
            url: '',
            main: '',
            mainNum: 10,
            minor: '',
            minorNum: 10,
            seasoning: '',
            seasoningNum: 10,
            description: '',
        }
        fileList.value = []
        dishesFormRef.value.resetFields()
    })
}

const mainList = ref<Ingredients[]>([])
const minorList = ref<Ingredients[]>([])
const seasoningList = ref<Ingredients[]>([])


const getIngredientsTypeList = async () => {
    try {
        mainList.value = await listByType('1')
        minorList.value = await listByType('2')
        seasoningList.value = await listByType('3')
    } catch (e) {
        console.log(e)
    }
}

const confirm = () => {
    dishesFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            if (!dishesForm.value.id) {
                await addDishes(dishesForm.value)
            } else {
                await updateDishes(dishesForm.value)
            }
            ElMessage.success('操作成功')
            dishesFormVisible.value = false
            listDishes(pageNum.value)
        }
    })
}

const handleEdit = (dishes: Dishes) => {
    dishesFormVisible.value = true
    nextTick(() => {
        dishesFormTitle.value = '添加菜品'
        dishesForm.value = { ...dishes }
        fileList.value = [{ name: dishes.url, url: base_url + dishes.url }]
        dishesFormRef.value.resetFields()
    })
}

const handleDelete = (id: number) => {
    ElMessageBox.confirm(
        '您确定要删除这条数据吗?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await deleteDishes(id).then(() => {
                ElMessage({
                    type: 'success',
                    message: '删除成功!',
                })
                listDishes(pageNum.value)
            }).catch(e => {
                console.log(e)
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}


/**** 进入页面直接执行 ******/
listDishes()
getIngredientsTypeList()

</script>

<template>
    <div class="add-container">
        <!-- 查询表单 -->
        <el-form ref="queryFormRef" :model="queryForm" inline @submit.native.prevent>
            <el-form-item label="菜品名称" prop="name">
                <el-input placeholder="请输入菜名" v-model="queryForm.name" @keyup.enter.native="listDishes()"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" plain icon="Search" @click="listDishes()">搜索</el-button>
                <el-button type="info" plain icon="Refresh" @click="resetQuerForm">重置</el-button>
                <el-button type=success plain icon="Plus" @click="handleAdd">添加</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <el-table border stripe :data="dishesList" style="width: 100%">
            <el-table-column type="index" label="编号" width="80px" align="center" />
            <el-table-column prop="name" label="菜品名称" align="center"></el-table-column>

            <el-table-column prop="mainName" label="主要食材" align="center"></el-table-column>
            <el-table-column prop="minorName" label="辅助食材" align="center"></el-table-column>
            <el-table-column prop="seasoningName" label="配料" align="center"></el-table-column>
            <el-table-column label="图片" align="center">
                <template #default="scope">
                    <el-image :src="base_url + scope.row.url" style="width: 40px; height: 40px;"
                        :preview-src-list="base_url + scope.row.url" preview-teleported></el-image>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="primary" @click="handleEdit(scope.row)" icon="Edit"></el-button>
                    <el-button type="danger" @click="handleDelete(scope.row.id)" icon="Delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页 -->
        <el-pagination background style="margin-top: 10px;" :total="total" layout="total,sizes,prev,pager,next,jumper"
            :page-sizes="[1, 5, 10, 50]" v-model:current-page="pageNum" v-model:page-size="pageSize"
            @current-change="listDishes" @size-change="listDishes()"></el-pagination>

        <!-- 添加,更新表单 -->
        <el-dialog v-model="dishesFormVisible" :title="dishesFormTitle" :close-on-click-modal="false" width="500">
            <el-form ref="dishesFormRef" :model="dishesForm" :rules="dishesFormRules" label-width="80">
                <el-form-item label="菜品名称" prop="name">
                    <el-input v-model="dishesForm.name" placeholder="请输入菜品名称" />
                </el-form-item>
                <el-form-item label="图片" prop="url">
                    <el-upload v-model:file-list="fileList" :action="base_url + '/dishes-service/upload/image'"
                        list-type="picture" :limit="fileLimit" :on-exceed="handleOnExceed" :on-success="handleOnSuccess"
                        :on-remove="handleOnRemove" :before-upload="handleBeforeUpload">
                        <el-button type="primary" plain icon="Plus" size="small">点击上传</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                支持jpg/png格式,大小不能超过1MB
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <div style="display: flex;">
                    <el-form-item label="主要食材" prop="main">
                        <el-select v-model="dishesForm.main" placeholder="请选择" clearable style="width: 100px;">
                            <el-option v-for="item in mainList" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="份量" prop="mainNum">
                        <el-input-number v-model="dishesForm.mainNum"></el-input-number>
                    </el-form-item>
                </div>
                <div style="display: flex;">
                    <el-form-item label="辅助食材" prop="minor">
                        <el-select v-model="dishesForm.minor" placeholder="请选择" clearable style="width: 100px;">
                            <el-option v-for="item in minorList" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="份量" prop="minorNum">
                        <el-input-number v-model="dishesForm.minorNum"></el-input-number>
                    </el-form-item>
                </div>
                <div style="display: flex;">
                    <el-form-item label="配料" prop="seasoning">
                        <el-select v-model="dishesForm.seasoning" placeholder="请选择" clearable style="width: 100px;">
                            <el-option v-for="item in seasoningList" :key="item.id" :label="item.name"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="份量" prop="seasoningNum">
                        <el-input-number v-model="dishesForm.seasoningNum"></el-input-number>
                    </el-form-item>
                </div>
                <el-form-item label="菜品描述" prop="description">
                    <el-input v-model="dishesForm.description" placeholder="请输入菜品描述" type="textarea" />
                </el-form-item>



            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dishesFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="confirm">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>