<script setup lang="ts">
import {ref} from 'vue'
import type { Dict } from '@/api/dict/types'
import { getDictList } from '@/api/dict'

const dictList = ref<Dict[]>([])

getDictList('ingredients').then((resp: Dict[]) => {
  dictList.value = resp
}).catch(e => {
  console.log(e)
})
</script>

<template>
<div class="about">
  <h1>{{ dictList }}</h1>
</div>
</template>

<style scoped>
</style>
