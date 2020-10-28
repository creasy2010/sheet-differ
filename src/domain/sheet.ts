/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/
import Cell from './cell'

export default class Sheet {
  /**
   * 节点集合;
   */
  cells: Cell[] = []

  /**
   * 节点布局信息;
   */
  layout: Cell[][] = []

  constructor(public sheetDto: any) {
    for (let rowIndex in sheetDto) {
      for (let columnIndex in sheetDto[rowIndex]) {
        let col = parseInt(columnIndex)
        let row = parseInt(rowIndex)
        let cell = new Cell(sheetDto[rowIndex][columnIndex], {
          col,
          row,
          width: 1,
          height: 1
        })

        this.cells.push(cell)
        if (!this.layout[row]) {
          if (this.layout.length == row - 1) {
            this.layout[row].push()
          } else {
            throw new Error('index 不连续::')
          }
        }
      }
    }
  }

  /**
   * 对比两个sheet中 相同与不同的部分
   * @param toSheet
   */
  diff(toSheet: Sheet) {
    //1. 通过唯一属性(sb)寻找相同节点 ;
    //2. 通过相同的节点反向推理. 不同的节点;
    //注: 对于 未知节点 忽略, 让人工进行处理;
  }
}
