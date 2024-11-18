import  request  from "@/util/request";
import type { Dict } from "@/api/dict/types";

const API: string = '/dishes-service'

export const getDictList = (type: string) => {
    return request<Dict[],Dict[]>({
        url: API + '/dict/list',
        method: 'get',
        params: {
            type
        }
    })
}