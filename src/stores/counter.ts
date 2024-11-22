import {ref, computed} from 'vue'
import {defineStore} from 'pinia'

/**
 * state  ref
 * action function
 * getter 计算属性
 */
export const useCounterStore = defineStore('counter', () => {

  // state
  const count = ref(0)

  // getter
  const doubleCount = computed(() => count.value * 2)

  // action 修改
  function increment() {
    count.value++
  }

  return {count, doubleCount, increment}
})
