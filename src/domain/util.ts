/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/28
 **/
export function addCol(
  sheetDTO: any,
  params: {
    addIndex: number
    getColumn?: () => any
    colCount?: number
  }
) {
  params = { addIndex: 0, colCount: 1, ...params }

  let copyData = JSON.parse(JSON.stringify(sheetDTO))
  let rows = map2Array(copyData)

  let result = []
  for (let i = 0, iLen = rows.length; i < iLen; i++) {
    let columns = map2Array(rows[i])
    columns.splice(params.addIndex, 0, [
      {
        style: {},
        value: ''
      }
    ])
    result.push(array2Map(columns))
  }
  return array2Map(result)
}
/***
 * 为json数据添加一行;
 * @param SheetDTO
 * @param addIndex
 */
export function addRow(
  SheetDTO: any,
  params: {
    addIndex: number
    getColumn?: () => any
    rowCount?: number
  }
) {
  params = { addIndex: 0, rowCount: 1, ...params }

  let copyData = JSON.parse(JSON.stringify(SheetDTO))
  let rows = map2Array(copyData)
  let newRow = array2Map(
    map2Array(rows[0]).map((item) => ({
      style: {},
      value: ''
    }))
  )
  rows.splice(params.addIndex, 0, newRow)
  let result = array2Map(rows)
  return JSON.parse(JSON.stringify(result))
}

function map2Array<T = any>(indexMap: { [index: string]: T }): T[] {
  let results = []
  for (let rowStr in indexMap) {
    results.push(indexMap[rowStr])
  }

  return results
}

function array2Map<T = any>(array: T[]): { [index: string]: T } {
  return array.reduce((acc, next, index) => {
    acc[index] = next
    return acc
  }, {})
}
