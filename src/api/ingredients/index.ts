import request from '@/util/request'
import type { Page } from '../types/page'
import type { Ingredients, IngredientsSearchParam } from './types'



/**
 * 接口
 * POST /dishes-service/ingredients
 * GET /dishes-service/ingredients/list
 * PUT /dishes-service/ingredients/{id}
 * DELETE /dishes-service/ingredients/{id}
 */
const API: string = '/dishes-service/ingredients'

export const getIngredientsList = (form: IngredientsSearchParam) => {
    return request<Page<Ingredients>,Page<Ingredients>>({
        url:API + '/list',
        method: 'get',
        params: form
    })
}

/**
 * 食材添加接口
 */
export const addIngredients = (form: Ingredients) => {
    return request<any,any,Ingredients>({
        url: API,
        method: 'post',
        data: form
    })
}
/** 
 * 更新
 */
export const updateIngredients = (id:number,form: Ingredients) => {
    return request<any,any,Ingredients>({
        url: API + `/${id}`,
        method: 'put',
        data: form
    })
}

/**
 * 删除 delete/ingredients/{id}
 */
export const deleteIngredients = (id:number) => {
    return request<any>({
        url: API + `/${id}`,
        method:'delete'
    })
}

export const listByType = (type: string) => {
    return request<Ingredients[],Ingredients[]>({
        url: API + `/listByType?type=${type}`,
        method:'get'
    })
}