import request from '@/util/request'
import type {Page} from '@/api/types/page'
import type {Ingredients, IngredientsSearchParam} from '@/api/ingredients/types'

/**
 * 接口
 * POST /dishes-service/ingredients
 * GET /dishes-service/ingredients/list
 * PUT /dishes-service/ingredients/{id}
 * DELETE /dishes-service/ingredients/{id}
 */
const API: string = '/dishes-service/ingredients'

/**
 * 查询食材列表
 */
export const getIngredientsList = (queryForm: IngredientsSearchParam) => {
  return request<Page<Ingredients>, Page<Ingredients>>({
    url: API + '/list',
    method: 'get',
    params: queryForm
  })
}

/**
 * 食材添加接口
 */
export const addIngredients = (form: Ingredients) => {
  return request<any, any, Ingredients>({
    url: API,
    method: 'post',
    data: form
  })
}

/** 更新 */
export const updateIngredients = (id: number, form: Ingredients) => {
  return request<any, any, Ingredients>({
    url: API + `/${id}`,
    method: 'put',
    data: form
  })
}

/** 删除 */
export const deleteIngredients = (id: number) => {
  return request<any, any>({
    url: API + `/${id}`,
    method: 'delete'
  })
}

/** 根据食材类型查询食材列表 */
export const listByType = (type: string) => {
  return request<Ingredients[], Ingredients[]>({
    url: API + `/listByType?type=${type}`,
    method: 'get'
  })
}

