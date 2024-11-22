import type {Dict} from '@/api/dict/types'
import {getDictList} from '@/api/dict'
import {ref} from "vue";

/**
 * 组合式函数
 * @param types 字典类型数组
 * const {dict} = useDict('gender', 'ingredients')
 */
export const useDict = (...types: string[]) => {

  /*
    保存字典列表的对象
    Map<String, List<Dict>>
    dict = {
      gender = [{name="男", value="1"}, {name="女", value="2"}],
      ingredients = [{name="主要食材", vale="1"}, {name="辅助食材", value="2"}]
    }
   */
  const dict = ref<any>({})

  const getDict = async (type: string) => {
    dict.value[type] = await getDictList(type)
  }

  /* 遍历字典类型, 查询对应字典列表 */
  types.forEach((type: string) => getDict(type))

  const showDictName = (type: string, value: string) => {
    return dict.value[type]?.find((item: Dict) => item.value == value).name
  }

  return {dict, showDictName}
}