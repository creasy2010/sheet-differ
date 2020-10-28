/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/
import Cell from './cell'
import cell from './cell'

export default class Sheet {
  /**
   * 节点集合;
   */
  cells: Cell[] = []

  maxRow = 0
  maxCol = 0
  /**
   * 节点布局信息;
   */
  layout: Cell[][] = []

  constructor(public sheetDto: any) {
    //1. 提取sheet cell信息;
    for (let rowIndex in sheetDto) {
      for (let columnIndex in sheetDto[rowIndex]) {
        let col = parseInt(columnIndex)
        let row = parseInt(rowIndex)

        //设置行列最大值;
        if (this.maxRow < row) {
          this.maxRow = row
        }
        if (this.maxCol < col) {
          this.maxCol = col
        }

        let cell = new Cell(sheetDto[rowIndex][columnIndex], {
          row,
          col,
          width: 1,
          height: 1
        })
        cell.ownedSheet = this

        this.cells.push(cell)
        //行不存在,则补一行;
        if (!this.layout[row]) {
          if (this.layout.length == row) {
            this.layout[row] = []
          } else {
            throw new Error('index 不连续::')
          }
        }
        this.layout[row].push(cell)
      }
    }
    //2. 关联相邻cell
    for (
      let rowIndex = 0, iLen = this.maxRow + 1;
      rowIndex < iLen;
      rowIndex++
    ) {
      for (
        let colIndex = 0, jLen = this.maxCol + 1;
        colIndex < jLen;
        colIndex++
      ) {
        this.layout[rowIndex][colIndex].cellLink = {
          left: this.getCel(rowIndex - 1, colIndex),
          top: this.getCel(rowIndex, colIndex - 1),
          bottom: this.getCel(rowIndex + 1, colIndex),
          right: this.getCel(rowIndex, colIndex + 1)
        }
      }
    }
  }

  getCel(row: number, col: number) {
    if (row < 0 || col < 0) {
      return
    }

    if (this.layout[row] && this.layout[row][col]) {
      return this.layout[row][col]
    }
    return
  }

  /**
   * 对比两个sheet中 相同与不同的部分
   * @param toSheet
   */
  diff(toSheet: Sheet) {
    //1. 通过唯一属性(sb)寻找相同节点 ;

    let saveSBCell = Sheet.getSameSBCell(this, toSheet)

    // 检测外部行列是否一致; 第一行, 第一列,最后一行, 最后一列;

    //1.1 寻找一样文本的; 逐级处理;

    //2. 通过相同的节点反向推理. 不同的节点;
    //注: 对于 未知节点 忽略, 让人工进行处理;
  }

  private static getSameSBCell(
    fromSheet: Sheet,
    toSheet: Sheet
  ): {
    from: Cell
    to: Cell
  }[] {
    let fromSbMap = fromSheet.cells.reduce((acc, next) => {
      if (next.isFormulaCell) {
        acc[next.tag.attribute.SB.trim()] = next
      }
      return acc
    }, {})

    let toSbMap = toSheet.cells.reduce((acc, next) => {
      if (next.isFormulaCell) {
        acc[next.tag.attribute.SB.trim()] = next
      }
      return acc
    }, {})

    let sameCells = []

    for (let fromSbMapKey in fromSbMap) {
      if (toSbMap[fromSbMapKey]) {
        sameCells.push({
          from: fromSbMap[fromSbMapKey],
          to: toSbMap[fromSbMapKey]
        })
      }
    }

    return sameCells
  }
}

/**
 *
 */
function getNearestCell(targetCell: cell, cells: Cell[]) {}
