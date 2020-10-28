/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/

import { oldData } from '../../data'
import Sheet from '../sheet'

describe('sheet基本使用', () => {
  it('初始化', async () => {
    let sheet = new Sheet(oldData)
    expect(sheet).not.toBeNull()
  })
  it('基本对比 ', async () => {})
})
