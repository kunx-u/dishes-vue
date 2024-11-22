<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { getDishesList } from '@/api/dishes'
import { listByType } from '@/api/ingredients'
import type { Dishes, DishesSearchParam } from '@/api/dishes/types'
import type { Ingredients } from '@/api/ingredients/types'
import { getCartList, saveOrUpdateCart, clearCart, deleteFromCart } from '@/api/cart'
import type { Cart } from '@/api/cart/types'

const base_url = import.meta.env.VITE_APP_BASE_API

/* 查询表单 */
const queryFormRef = ref()
const queryForm = ref<DishesSearchParam>({
  main: '',
  minor: '',
  seasoning: '',
})

const pageNum = ref(1)
const pageSize = ref(4)
const total = ref(0)
const dishesList = ref<Dishes[]>([])

const listDishes = (pageNumber = 1) => {
  pageNum.value = pageNumber
  getDishesList(pageNum.value, pageSize.value, queryForm.value).then(resp => {
    total.value = resp.total
    dishesList.value = resp.rows
  }).catch(e => {
    console.log(e)
  })
}

/* 三个食材类型列表 */
const mainList = ref<Ingredients[]>([])
const minorList = ref<Ingredients[]>([])
const seasoningList = ref<Ingredients[]>([])

const getIngredientsListByType = async () => {
  mainList.value = await listByType('1')
  minorList.value = await listByType('2')
  seasoningList.value = await listByType('3')
}

/* 侦听 */
watch(queryForm.value, (v1, v2) => {
  listDishes()
})

/* 重置 */
const resetQueryForm = () => {
  queryFormRef.value.resetFields()
}

/******************** 购物车功能 *************************/

const cartList = ref<Cart[]>([])

const listCart = () => {
  getCartList().then((resp: Cart[]) => {
    cartList.value = resp
  }).catch(e => {
    console.log(e)
  })
}
/****** 点击添加预制 ******/
const addToCart = async(dishes: Dishes) => {
  let cart = cartList.value.find(item => item.dishesId === dishes.id)
  if (cart) {// 列表中已经存在这个菜品
    cart.count++
  } else {// 列表中没有这个菜品
    cart = { dishesId: dishes.id as number, name: dishes.name, count: 1 }
  }
  // 发送请求到服务器
  await saveOrUpdateCart(cart)

  if (cart.count == 1) {
    cartList.value.unshift(cart)
  }

}

/******** 点击列表中的加减 *******/
const updateCartCount = async (item: Cart) => {
  await saveOrUpdateCart(item)
}

/*********** 点击购物车列表的删除按钮 **************/
const deleteDishesFormCart = async (dishesId: number) => {
  await deleteDishesFormCart(dishesId)

  cartList.value = cartList.value.filter(item => item.dishesId != dishesId)

}


/******/
listDishes()
getIngredientsListByType()
listCart()
</script>

<template>
  <el-table :data="cartList" border stripe style="width: 100%;">
    <el-table-column label="菜品ID" prop="dishesId" align="center" width="100"></el-table-column>
    <el-table-column label="菜品名称" prop='name' align="center"></el-table-column>
    <el-table-column label="菜品数量" align="center">
      <template #default="scope">
        <el-input-number :min="1" :max="10" v-model="scope.row.count"
          @change="updateCartCount(scope.row)"></el-input-number>
      </template>
    </el-table-column>
    <el-table-column align="center">
      <template #default="scope">
        <el-button type="danger" plain icon="Delete" @click="deleteDishesFormCart(scope.row.dishesId)"></el-button>
      </template>
    </el-table-column>
  </el-table>


  <div class="app-container">
    <el-form ref="queryFormRef" :model="queryForm" inline>
      <el-form-item prop="main">
        <el-select style="width: 180px" v-model="queryForm.main" placeholder="请选择主要食材" clearable>
          <el-option v-for="item in mainList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="minor">
        <el-select style="width: 180px" v-model="queryForm.minor" placeholder="请选择辅助食材" clearable>
          <el-option v-for="item in minorList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item prop="seasoning">
        <el-select style="width: 180px" v-model="queryForm.seasoning" placeholder="请选择配料" clearable>
          <el-option v-for="item in seasoningList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" plain icon="Refresh" @click="resetQueryForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表数据 -->
    <el-row :gutter="10">
      <el-col :span="6" v-for="dishes in dishesList" :key="dishes.id">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom: 10px">
          <img :src="base_url + dishes.url" class="image" />
          <div style="padding: 14px;">
            <div class="dishes">
              <span>菜品名称：{{ dishes.name }}</span>
              <el-button type="primary" text @click="addToCart(dishes)">加入预制</el-button>
            </div>
            <div class="ingredients">
              <span>主要食材：{{ dishes.mainName }}</span>
            </div>
            <div class="ingredients">
              <span>辅助食材：{{ dishes.minorName }}</span>
            </div>
            <div class="ingredients">
              <span>配料食材：{{ dishes.seasoningName }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页条 -->
    <el-pagination :total="total" layout="total, sizes, prev, pager, next, jumper" background :page-sizes="[4, 8, 12]"
      v-model:current-page="pageNum" v-model:page-size="pageSize" @current-change="listDishes"
      @size-change="listDishes()" />
  </div>
</template>

<style scoped>
.image {
  width: 100%;
  display: block;
  height: 200px;
}

.dishes {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1B1B1B;
  line-height: 1.4;
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}

.ingredients {
  margin-top: 5px;
  font-size: 12px;
  color: #999;
}
</style>