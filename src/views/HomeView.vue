<template>
  <el-container class="container">
    <!-- 左侧边栏 -->
    <el-aside>
      <el-scrollbar>
        <el-menu
          :default-active="route.path"
          router
          active-text-color="#ffd04b"
          background-color="#003153"
          text-color="#fff"
          :collapse="isCollapse"
          :collapse-transition="false">
          <!-- logo + 文字 -->
          <div style="display: flex; justify-content: flex-start; align-items: center; height: 40px">
            <img src="../assets/logo.svg" style="height: 18px; width: 18px; margin: 0 15px 0 25px">
            <span style="color: #FFF; font-weight: bold;" v-show="!isCollapse">管理系统</span>
          </div>

          <!-- 食材 | 菜品管理 -->
          <el-sub-menu index="/ingredients">
            <template #title>
              <el-icon>
                <knife-fork/>
              </el-icon>
              <span>食材 | 菜品管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/ingredients">
                <el-icon>
                  <knife-fork/>
                </el-icon>
                <span>食材管理</span>
              </el-menu-item>
              <el-menu-item index="/dishes">
                <el-icon>
                  <knife-fork/>
                </el-icon>
                <span>菜品管理</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <!-- 菜品预制 -->
          <el-menu-item index="/prepare">
            <el-icon>
              <shopping-cart/>
            </el-icon>
            <span>菜品预制</span>
          </el-menu-item>

          <!-- 预制订单 -->
          <el-menu-item index="/order">
            <el-icon>
              <dish/>
            </el-icon>
            <span>预制订单</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <!-- 右侧区域 -->
    <el-container>
      <!-- 头 -->
      <el-header style="cursor:pointer; display: flex; align-items: center;  box-shadow: 0px 2px #eeeeee">
        <el-icon :size="30" @click="isCollapse = !isCollapse">
          <!-- 展开 -->
          <expand v-show="isCollapse"/>
          <!-- 折叠 -->
          <fold v-show="!isCollapse"/>
        </el-icon>
        <!-- Flex布局中, 让最后一个元素居右侧 margin-left: auto -->
        <div style="margin-left: auto">
          <el-dropdown>
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"/>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ tokenStore.getUsername }}</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主体区域 - 用于展示 -->
      <el-main>
        <el-scrollbar>
          <router-view/>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRoute} from 'vue-router'
import { userTokenStore } from '@/stores/useTokenStore';

const tokenStore = userTokenStore()
/* 是否折叠左侧边栏 */
const isCollapse = ref(false)
const route = useRoute()

</script>

<style scoped>
/* 最外层container */
.container {
  height: 100vh;
}

/* 侧边栏 */
.el-aside {
  width: auto;
  background-color: #003153;
}

/* 解决1像素侧边栏问题 */
.el-menu {
  border-right: none;
}

/* 主体右侧的滚动条 */
.el-main {
  padding-right: 0px;
}
</style>