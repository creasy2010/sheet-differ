/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/

import {oldData} from "../../data";
import Sheet from "../sheet";

describe('sheet基本使用', () => {
  it('初始化', async () => {
    let cellItem   = new Sheet(oldData as any);
    // expect(cellItem.tag).not.toBeNull();
  });
  it('基本对比 ', async () =>{

  });
});
