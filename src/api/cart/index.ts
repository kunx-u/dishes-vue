import request from '@/util/request'
import type { Cart } from './types'

const API: string = '/dishes-service/cart'



export const getCartList = () => {
    return request<Cart[], Cart[]>({
        url: API,
        method: 'get'
    })
}


export const saveOrUpdateCart = (data:Cart) => {
    return request<any,any,Cart>({
        url: API,
        method: 'post',
        data
    })
}

export const deleteFromCart = (dishesId: number) => {
    return request<any,any>({
        url: API + `/dishes/${dishesId}`,
        method: 'delete'
    })
}


export const clearCart = () => {
    return request<any,any>({
        url: API,
        method: 'delete'
    })
}