/** 查询参数类型  */

export interface DishesSearchParam {
    name?: string
    main?: string | number
    minor?: string | number
    seasoning?:string | number
}


/** 菜品类型  */
export interface Dishes {
    id?:number
    
    name: string
    url: string
    main: number | string
    mainNum: number | string
    minor: number | string
    minorNum: number | string
    seasoning: number | string
    seasoningNum: number | string
    description: string

    createTime?: string
    updateTime?: string

    mainName?: string
    minorName?: string
    seasoningName?: string
}