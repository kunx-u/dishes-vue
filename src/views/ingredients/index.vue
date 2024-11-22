<script setup lang="ts">
import {ref, reactive, nextTick} from 'vue'
import {getIngredientsList, addIngredients, updateIngredients, deleteIngredients} from '@/api/ingredients'
import type {Page} from '@/api/types/page'
import type {IngredientsSearchParam, Ingredients} from '@/api/ingredients/types'
/* 导入组合式函数 */
import {useDict} from '@/util/useDict'
import type {FormRules, UploadProps, UploadUserFile} from 'element-plus'
import {ElMessage, ElMessageBox} from "element-plus";
import {useTokenStore} from '@/stores/useTokenStore'

const tokenStore = useTokenStore()

const INGREDIENTS = 'ingredients'

// 使用组合式函数
const {dict, showDictName} = useDict(INGREDIENTS)

// http://localhost:8080
const base_url = import.meta.env.VITE_APP_BASE_API

/* 查询表单 */
const queryFormRef = ref()
const queryForm = reactive<IngredientsSearchParam>({
  pageNum: 1,
  pageSize: 5,
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

/* 重置查询表单 */
const resetQueryForm = () => {
  queryFormRef.value.resetFields()
  listIngredients()
}

/********* 添加 **********/
const ingredientsFormVisible = ref(false)
const ingredientsFormTitle = ref('添加食材')

const ingredientsFormRef = ref()
const ingredientsForm = ref<Ingredients>({
  name: '',
  type: '',
  url: '',
  description: ''
})
const ingredientsFormRules = ref<FormRules>({
  name: [{required: true, message: '请输入食材名称'}],
  type: [{required: true, message: '请选择类型'}],
  url: [{required: true, message: '请上传图片'}],
  description: [{required: true, message: '请输入食材描述'}],
})

// 图片列表
const fileList = ref<UploadUserFile[]>([])

// 限制一张图片
const fileLimit = ref(1)

/* 上传成功后执行 */
const handleUploadSuccess: UploadProps['onSuccess'] = (response, file, files) => {
  ingredientsForm.value.url = response.data
  // 上传成功后重新校验url
  ingredientsFormRef.value.validateField('url')
}

/* 删除时执行 */
const handleRemove: UploadProps['onRemove'] = (file, files) => {
  ingredientsForm.value.url = ''
  fileList.value = []

  // 删除后重新校验url
  ingredientsFormRef.value.validateField('url')
}

/* 上传前执行 */
const handleBeforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type == 'image/jpeg'
  const isPNG = file.type == 'image/png'

  const isLt1MB = file.size / 1024 / 1024 < 1

  if (!isJPG && !isPNG) {
    ElMessage.warning('仅支持jpg/png格式')
    return false
  }

  if (!isLt1MB) {
    ElMessage.warning('大小不能超过1MB')
    return false
  }
}

/* 超出上传限制时执行 */
const handleOnExceed: UploadProps['onExceed'] = (files) => {
  ElMessage.warning('不能超过' + fileLimit.value + '张图片')
}

const handleAdd = () => {
  ingredientsFormVisible.value = true
  nextTick(() => {
    ingredientsFormTitle.value = '添加食材'
    ingredientsForm.value = {
      name: '',
      type: '',
      url: '',
      description: ''
    }
    fileList.value = []
    ingredientsFormRef.value.resetFields()
  })
}

/* 点击添加、修改对话框的确认按钮 */
const confirm = () => {
  ingredientsFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 没有id就是添加
      if (!ingredientsForm.value.id) {
        await addIngredients(ingredientsForm.value)
        queryForm.pageNum = 1
      } else { // 有id就是更新
        await updateIngredients(ingredientsForm.value.id, ingredientsForm.value)
      }
      ElMessage.success('操作成功！')
      ingredientsFormVisible.value = false
      listIngredients(queryForm.pageNum)
    }
  })
}

const handleEdit = (row: Ingredients) => {
  ingredientsFormVisible.value = true
  nextTick(() => {
    ingredientsFormTitle.value = '编辑食材信息'

    // 解构赋值
    ingredientsForm.value = {...row}
    fileList.value = [{name: row.url, url: base_url + row.url}]
  })
}

/*  删除 */
const handleDelete = (id: number) => {
  ElMessageBox.confirm('确认删除?', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    await deleteIngredients(id)
    ElMessage.success('删除成功！')
    listIngredients(queryForm.pageNum)
  }).catch(() => {
    ElMessage.info('取消删除')
  })
}

/* 进入页面立即执行的方法 */
listIngredients()
</script>

<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <el-form
      :model="queryForm"
      ref="queryFormRef"
      inline>
      <!-- 食材名称 -->
      <el-form-item label="食材名称" prop="name">
        <el-input v-model="queryForm.name" placeholder="请输入食材名称"/>
      </el-form-item>
      <!--食材类型 -->
      <el-form-item label="食材类型" prop="type">
        <el-select
          v-model="queryForm.type"
          placeholder="请选择"
          clearable
          style="width: 180px">
          <el-option
            v-for="item in dict[INGREDIENTS]"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <!-- 搜索、重置、添加按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          plain
          icon="Search"
          @click="listIngredients()">
          搜索
        </el-button>
        <el-button
          type="info"
          plain
          icon="Refresh"
          @click="resetQueryForm">
          重置
        </el-button>
        <el-button
          type="success"
          plain
          icon="Plus"
          @click="handleAdd">
          添加
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 列表数据 -->
    <el-table
      :data="ingredientsList"
      border
      stripe
      style="width: 100%">
      <el-table-column type="index" label="编号" width="80px" align="center"/>
      <el-table-column label="食材名称" prop="name" align="center"/>
      <el-table-column label="食材类型" align="center">
        <template #default="scope">
          <el-tag>{{ showDictName(INGREDIENTS, scope.row.type) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="食材图片" align="center">
        <template #default="{row}">
          <el-image
            :src="base_url + row.url"
            style="width: 40px; height: 40px;"
            :preview-src-list="[base_url + row.url]"
            preview-teleported
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template #default="scope">
          <el-button type="primary" plain icon="Edit" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="danger" plain icon="Delete" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination
      style="margin-top: 10px"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      v-model:current-page="queryForm.pageNum"
      v-model:page-size="queryForm.pageSize"
      @current-change="listIngredients"
      @size-change="listIngredients()"
    />

    <!-- 添加、修改对话框 -->
    <el-dialog
      v-model="ingredientsFormVisible"
      :title="ingredientsFormTitle"
      :close-on-click-modal="false"
      width="600">
      <el-form
        ref="ingredientsFormRef"
        :model="ingredientsForm"
        :rules="ingredientsFormRules"
        label-width="80">
        <!-- 食材名称 -->
        <el-form-item label="食材名称" prop="name">
          <el-input v-model="ingredientsForm.name" placeholder="请输入食材名称"/>
        </el-form-item>
        <!-- 上传图片 -->
        <el-form-item label="上传图片" prop="url">
          <el-upload
            :headers="{'Authorization': tokenStore.getToken}"
            v-model:file-list="fileList"
            :action="base_url + '/dishes-service/upload/image'"
            list-type="picture"
            :limit="fileLimit"
            :on-exceed="handleOnExceed"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            :on-remove="handleRemove"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">仅支持jpg/png格式, 大小不超过1MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- 食材类型 -->
        <el-form-item label="食材类型" prop="type">
          <el-radio-group v-model="ingredientsForm.type">
            <el-radio
              v-for="item in dict[INGREDIENTS]"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>
        <!-- 食材描述 -->
        <el-form-item label="食材描述" prop="description">
          <el-input
            type="textarea"
            v-model="ingredientsForm.description"
            placeholder="请输入食材描述"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ingredientsFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>