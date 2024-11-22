import request from '@/util/request'
import type {Page} from '@/api/types/page'
import type {DishesSearchParam, Dishes} from '@/api/dishes/types'

const API: string = '/dishes-service/dishes'

/**
 * get /dishes-service/dishes/list
 */
export const getDishesList = (pageNum: number, pageSize: number, queryForm: DishesSearchParam) => {
  return request<Page<Dishes>, Page<Dishes>>({
    url: API + '/list',
    method: 'get',
    params: {
      pageNum,
      pageSize,
      ...queryForm
    }
  })
}

/** 添加  post /dishes-service/dishes */
export const addDishes = (form: Dishes) => {
  return request<any, any, Dishes>({
    url: API,
    method: 'post',
    data: form
  })
}

/** 更新  put /dishes-service/dishes/{id} */
export const updateDishes = (form: Dishes) => {
  return request<any, any, Dishes>({
    url: API + `/${form.id}`,
    method: 'put',
    data: form
  })
}

/** 删除  delete /dishes-service/dishes/{id} */
export const deleteDishes = (id: number) => {
  return request<any, any>({
    url: API + `/${id}`,
    method: 'delete'
  })
}