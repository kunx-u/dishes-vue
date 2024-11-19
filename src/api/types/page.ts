/** Page 对象  */

export interface Page<T> {
    pageNum: number
    pageSize: number
    rows: T[]
    total: number
}