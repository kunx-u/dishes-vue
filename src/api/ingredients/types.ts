/** 食材查询条件类型 */
export interface IngredientsSearchParam {
  pageNum: number
  pageSize: number
  // 食材名称
  name: string
  // 食材类型
  type: string
}

/** 食材类型 */
export interface Ingredients {
  id?: number
  name: string
  type: string
  url: string
  description: string
  createTime?: string
  updateTime?: string
}