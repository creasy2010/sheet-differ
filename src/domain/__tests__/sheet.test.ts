/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/

import { oldData, newData } from '../../data'
import Sheet from '../sheet'
import { basicData } from './add-row-datas'
import { addRow } from '../util'

describe('sheet基本使用', () => {
  it('初始化', async () => {
    let sheet = new Sheet(oldData)
    expect(sheet).not.toBeNull()
  })
  it('基本对比 ', async () => {
    //全部相等的;
    let newData = addRow(basicData, { addIndex: 1 })
    let oldSheet = new Sheet(basicData)
    let newSheet = new Sheet(newData)
    oldSheet.adapter(newSheet)

    console.log('老sheet值::')
    oldSheet.print()
    console.log('新sheet值::')
    newSheet.print()
    //新增加一行

    //减少一行;
  })
})
