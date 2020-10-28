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
  it('基本对比-添加行 ', async () => {
    //全部相等的;
    let newData1 = addRow(basicData, { addIndex: 1 })
    let newData2 = addRow(newData, { addIndex: 3 })
    let oldSheet = new Sheet(basicData)
    let new1Sheet = new Sheet(newData1)
    oldSheet.adapter(new1Sheet)
    console.log('老sheet值::')
    oldSheet.print()
    console.log('新sheet值::')
    new1Sheet.print()

    let new2Sheet = new Sheet(newData2)
    console.log('新sheet值::')
    oldSheet.adapter(new2Sheet)
    new2Sheet.print()
    //新增加一行

    //减少一行;
  })
})
