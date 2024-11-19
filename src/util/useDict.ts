import type { Dict } from "@/api/dict/types";
import { getDictList } from "@/api/dict";
import { ref } from "vue";

/**
 * 组合式函数
 * @param types 字典类型数组
 */
export const useDict = (...types:string[]) => {

    // 保存字典列表的对象
    const dict = ref<any>({})
    const getDict = async (type:string) => {
        dict.value[type] = await getDictList(type)
    }
    /* 遍历字典类型,查询对应字典列表 */
    types.forEach((type: string) => getDict(type))

    const showDictName = (type:string,value:string) => {
        return dict.value[type]?.find((item:Dict) => item.value === value).name
    }

    return {dict,showDictName}

}