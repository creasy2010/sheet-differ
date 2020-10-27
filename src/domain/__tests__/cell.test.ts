/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/

import {oldData} from "../../data";
import Cell from "../cell";



describe('cell基本使用', () => {
  it('初始化', async () => {
    let cellItem   = new Cell(cellDto as any);
    expect(cellItem.tag).not.toBeNull();
  });
  it('基本对比 ', async () =>{
    let cell1Item   = new Cell(cellDto as any);
    let cell2Item   = new Cell(cellDto as any);

  });
});


let cellDto ={
  style: {
    hAlign: 2,
    backColor: 'rgb(255, 255, 255)',
    borderRight: {
      color: 'rgb(0, 0, 0)',
      style: 1
    },
    vAlign: 1,
    borderTop: {
      color: 'rgb(0, 0, 0)',
      style: 1
    },
    borderBottom: {
      color: 'rgb(0, 0, 0)',
      style: 1
    },
    font:
      '14px -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  tag:
    '{"backFormula":"RefTemplate(资产负债表,D6)","attribute":"{\\"SB\\":\\"BlankCell&name<snncyezc&row<0&tax<资产负债表_货币资金_上年年末余额\\",\\"SWCSH\\":\\"\\",\\"FK\\":\\"BlankCell&row<10&column<3&containChinese<true\\"}","frontFormula":null}'
}
