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

describe('sheet基本使用', () => {
  it('初始化', async () => {
    let sheet = new Sheet(oldData)
    expect(sheet).not.toBeNull()
  })
  it('基本对比 ', async () => {
    //全部相等的;
    let oldSheet = new Sheet(oldData)
    let newSheet = new Sheet(newData)
    oldSheet.diff(oldSheet)

    //新增加一行

    //减少一行;
  })
})
