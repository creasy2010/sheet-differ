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
import { addCol, addRow } from '../util'

describe('sheet基本使用', () => {
  it('初始化', async () => {
    let sheet = new Sheet(oldData)
    expect(sheet).not.toBeNull()
  })
  it('基本对比-添加一行 ', async () => {
    let rowLength = Object.keys(basicData).length
    let addIndex = [0, Math.floor(rowLength / 2), rowLength - 1]

    for (let i = 0, iLen = addIndex.length; i < iLen; i++) {
      let indexItem = addIndex[i]
      //全部相等的;
      let newData1 = addRow(basicData, { addIndex: indexItem })

      let oldSheet = new Sheet(basicData)
      let new1Sheet = new Sheet(newData1)
      oldSheet.adapter(new1Sheet)
      expect(oldSheet.toString()).toEqual(new1Sheet.toString())
    }
    //减少一行;
  })
  it('基本对比-添加二行 ', async () => {
    //全部相等的;
    let newData1 = addRow(basicData, { addIndex: 1 })
    let newData2 = addRow(newData1, { addIndex: 3 })

    let oldSheet = new Sheet(basicData)
    let new1Sheet = new Sheet(newData2)

    oldSheet.adapter(new1Sheet)
    expect(oldSheet.toString()).toEqual(new1Sheet.toString())
  })

  it('基本对比-添加一列 ', async () => {
    let colLength = Object.keys(basicData['0']).length
    let addIndex = [
      // 0, Math.floor(colLength / 2),
      colLength - 1
    ]

    for (let i = 0, iLen = addIndex.length; i < iLen; i++) {
      let addIndexItem = addIndex[i]

      //全部相等的;
      let newData1 = addCol(basicData, { addIndex: addIndexItem })
      let oldSheet = new Sheet(basicData)
      let new1Sheet = new Sheet(newData1)
      oldSheet.adapter(new1Sheet)

      expect(oldSheet.toString()).toEqual(new1Sheet.toString())
    }
  })

  it('基本对比-添加二列 ', async () => {
    //全部相等的;
    let newData1 = addCol(addCol(basicData, { addIndex: 1 }), { addIndex: 2 })

    let oldSheet = new Sheet(basicData)
    let new1Sheet = new Sheet(newData1)

    oldSheet.adapter(new1Sheet)
    console.log(oldSheet.print())

    console.log(new1Sheet.print())

    expect(oldSheet.toString()).toEqual(new1Sheet.toString())
  })
})

describe('sheet 变换单元格位置', () => {
  it('移动sb属性单元格', async () => {
    expect('hello').toEqual('hello')
  })
})
