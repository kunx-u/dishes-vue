import request from '@/util/request'
import type { Page } from '../types/page'
import type { DishesSearchParam,Dishes } from './types'

const API: string = '/dishes-service/dishes'

export const getDishesList = (pageNum:number,pageSize:number,queryForm:DishesSearchParam) => {
    return request<Page<Dishes>,Page<Dishes>>({
        url: API + '/list',
        method: 'get',
        params:{
            pageNum,
            pageSize,
            ...queryForm
        }
    })
}

export const addDishes = (form: Dishes) => {
    return request<any,any,Dishes>({
        url:API,
        method:'post',
        data:form
    })
}

export const updateDishes = (form:Dishes) => {
    return request<any,any,Dishes>({
        url:API + `/${form.id}`,
        method: 'put',
        data:form
    })
}

export const deleteDishes = (id:number) => {
    return request<any,any>({
        url:API + `/${id}`,
        method: 'delete',
    })
}