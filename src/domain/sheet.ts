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
import { addRow } from './util'
import BlankCell from './blank-cell'

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
   * 假设sheet不相同只是因为添加行或添加了列,
   * 那么对比少的部分, 补充这个行与列就可以了.
   *
   * @param toSheet
   */
  adapter(toSheet: Sheet) {
    //1. 通过唯一属性(sb)寻找相同节点 ;
    let saveSBCells: {
      from: Cell
      to: Cell
    }[] = Sheet.getSameSBCell(this, toSheet)

    saveSBCells.forEach((it) => logCompareNodes({ ...it, pre: 'saveSBCells' }))
    //2. 以sb相等结点为基础;向上下左右扩展寻找一定相等的节点;  value;

    let valeCells: {
      from: Cell
      to: Cell
    }[] = []

    for (let i = 0, iLen = saveSBCells.length; i < iLen; i++) {
      let saveSBCell = saveSBCells[i]
      valeCells = valeCells.concat(
        Sheet.getValueEqualCells(saveSBCell.from, saveSBCell.to)
      )
    }

    valeCells.forEach((it) => logCompareNodes({ ...it, pre: 'valeCells' }))
    //3.1添加blankCell 补行, 或列;
    let allCompCells = [...saveSBCells, ...valeCells]
    // 判断 索引是否有不一致的情况;
    let rowSortedComp = allCompCells.sort((a, b) => {
      return a.from.location.row - b.from.location.row
    })

    let fromAddedRowIndex = [],
      toAddedRowIndex = []
    for (let i = 0, iLen = rowSortedComp.length; i < iLen; i++) {
      let { from, to } = rowSortedComp[i]
      let fromIndex = from.location.row + fromAddedRowIndex.length
      let toIndex = to.location.row + toAddedRowIndex.length

      if (fromIndex < toIndex) {
        if (!fromAddedRowIndex.includes(fromIndex)) {
          fromAddedRowIndex.push(fromIndex)
          //from少行补
          this.addBlankRow(fromIndex - 1, toIndex - fromIndex)
        }
      } else if (fromIndex > toIndex) {
        if (!toAddedRowIndex.includes(toIndex)) {
          toAddedRowIndex.push(toIndex)
          // to少行.
          toSheet.addBlankRow(toIndex - 1, fromIndex - toIndex)
        }
      }
    }

    //3.2 添加blankCell 补行, 或列;
    let colSortedComp = rowSortedComp.sort((a, b) => {
      return b.from.location.col - a.from.location.col
    })

    let fromAddedColIndex = [],
      toAddedColIndex = []
    for (let i = 0, iLen = colSortedComp.length; i < iLen; i++) {
      let { from, to } = colSortedComp[i]

      let fromIndex = from.location.col + fromAddedColIndex.length
      let toIndex = to.location.col + toAddedColIndex.length

      if (fromIndex < toIndex) {
        if (!fromAddedColIndex.includes(fromIndex)) {
          fromAddedColIndex.push(fromIndex)
          //from少行补
          this.addBlankCol(fromIndex - 1, toIndex - fromIndex)
        }
      } else if (fromIndex > toIndex) {
        if (!toAddedColIndex.includes(toIndex)) {
          toAddedColIndex.push(toIndex)
          // to少行.
          toSheet.addBlankCol(toIndex - 1, fromIndex - toIndex)
        }
      }
    }
  }

  public addBlankCol(addColIndex: number, colCount: number = 1) {
    //添加一行新的;
    for (
      let colCountSum = 0, rowCountSumLen = colCount;
      colCountSum < rowCountSumLen;
      colCountSum++
    ) {
      addColIndex = addColIndex + colCountSum

      for (let rowIndex = 0, iLen = this.maxRow; rowIndex < iLen; rowIndex++) {
        let colBlancCell = new BlankCell(
          {},
          {
            col: rowIndex,
            row: addColIndex
          }
        )
        //添加blank列数据;
        this.layout[rowIndex].splice(addColIndex, 0, colBlancCell)
      }

      //重新关联节点;
      for (let rowIndex = 0, iLen = this.maxRow; rowIndex < iLen; rowIndex++) {
        let colBlancCell = this.getCel(rowIndex, addColIndex)

        colBlancCell.cellLink = {
          top: this.getCel(rowIndex - 1, addColIndex),
          bottom: this.getCel(rowIndex + 1, addColIndex),
          left: this.getCel(rowIndex, addColIndex - 1),
          right: this.getCel(rowIndex, addColIndex + 1)
        }

        if (this.layout[rowIndex][addColIndex - 1]) {
          this.layout[rowIndex][addColIndex - 1].cellLink.right = this.layout[
            rowIndex
          ][addColIndex]
        }
        if (this.layout[rowIndex][addColIndex + 1]) {
          this.layout[rowIndex][addColIndex + 1].cellLink.left = this.layout[
            rowIndex
          ][addColIndex]
        }
      }
    }
  }

  public addBlankRow(addIndex: number, rowCount: number = 1) {
    // this.maxCol
    //添加一行新的;

    for (
      let rowCountSum = 0, rowCountSumLen = rowCount;
      rowCountSum < rowCountSumLen;
      rowCountSum++
    ) {
      addIndex = addIndex + rowCountSum

      let blankRow = []
      for (let colIndex = 0, iLen = this.maxCol; colIndex < iLen; colIndex++) {
        let colBlancCell = new BlankCell(
          {},
          {
            col: colIndex,
            row: addIndex
          }
        )
        blankRow.push(colBlancCell)
      }
      this.layout.splice(addIndex, 0, blankRow)

      //重新关联节点;
      for (let colIndex = 0, iLen = this.maxCol; colIndex < iLen; colIndex++) {
        let colBlancCell = this.getCel(addIndex, colIndex)

        colBlancCell.cellLink = {
          top: this.getCel(addIndex - 1, colIndex),
          bottom: this.getCel(addIndex + 1, colIndex),
          left: this.getCel(addIndex, colIndex - 1),
          right: this.getCel(addIndex, colIndex + 1)
        }

        if (this.layout[addIndex - 1]) {
          this.layout[addIndex - 1][colIndex].cellLink.bottom = this.layout[
            addIndex
          ][colIndex]
        }
        if (this.layout[addIndex + 1]) {
          this.layout[addIndex + 1][colIndex].cellLink.top = this.layout[
            addIndex
          ][colIndex]
        }
      }
    }
  }

  /**
   * 以sb相等结点为基础;向上下左右扩展寻找一定相等的节点;  value;
   * @private
   */
  private static getValueEqualCells(
    from: Cell,
    to: Cell
  ): { from: Cell; to: Cell }[] {
    let targetCells = []
    let _allCells: Cell[] = [] //用户记录已经匹配的, 未匹配的, 不处理了
    Sheet.getDirectionValue(from, to, targetCells, _allCells, 'left')
    Sheet.getDirectionValue(from, to, targetCells, _allCells, 'right')
    Sheet.getDirectionValue(from, to, targetCells, _allCells, 'top')
    Sheet.getDirectionValue(from, to, targetCells, _allCells, 'bottom')
    return targetCells
  }

  private static getDirectionValue(
    from: Cell,
    to: Cell,
    targetCells,
    nodeQuals: Cell[],
    direction: 'left' | 'top' | 'right' | 'bottom'
  ) {
    //先找${direction}
    let _from = from,
      _to = to

    do {
      if (_from.cellLink[direction] && _to.cellLink[direction]) {
        if (
          _from.cellLink[direction].value &&
          _from.cellLink[direction].value === _to.cellLink[direction].value
        ) {
          //相等,则记录新的cell匹配单元
          if (
            nodeQuals.includes(_from.cellLink[direction]) ||
            nodeQuals.includes(_to.cellLink[direction])
          ) {
            console.log(`已匹配节点,忽略:${_from.location},${_to.location}`)
          } else {
            targetCells.push({
              from: _from.cellLink[direction],
              to: _to.cellLink[direction]
            })
            nodeQuals.push(_from.cellLink[direction])
            nodeQuals.push(_to.cellLink[direction])
          }
          _from = _from.cellLink[direction]
          _to = _to.cellLink[direction]
        } else {
          //不相等, 则下移下一个;
          _to = _to.cellLink[direction]
        }
      } else if (_from.cellLink[direction] && !_to.cellLink[direction]) {
        _from = _from.cellLink[direction]
        _to = to
      } else {
        break
      }
    } while (true)
  }

  print() {
    let fina = []
    for (
      let rowIndex = 0, rowIndexLen = this.layout.length;
      rowIndex < rowIndexLen;
      rowIndex++
    ) {
      let rowItem = this.layout[rowIndex]

      let result = []
      for (
        let colIndex = 0, colIndexLen = rowItem.length;
        colIndex < colIndexLen;
        colIndex++
      ) {
        let rowItemElement = rowItem[colIndex]
        result.push(getCellInfo(this.getCel(rowIndex, colIndex)))
      }
      fina.push(result.join('\t'))
    }
    console.log(fina.join('\n'))
  }
  /**
   * 获取相同属性的节点;
   * @param fromSheet
   * @param toSheet
   * @private
   */
  private static getSameSBCell(
    fromSheet: Sheet,
    toSheet: Sheet
  ): {
    from: Cell
    to: Cell
  }[] {
    let fromSbMap = fromSheet.cells.reduce((acc, next) => {
      if (next.isFormulaCell && next.tag.attribute.SB.trim()) {
        acc[next.tag.attribute.SB.trim()] = next
      }
      return acc
    }, {})

    let toSbMap = toSheet.cells.reduce((acc, next) => {
      if (next.isFormulaCell && next.tag.attribute.SB.trim()) {
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

function logCompareNodes(param: { from: Cell; to: Cell; pre?: string }) {
  console.log(
    `${param.pre}::匹配节点::row:${param.from.location.row},col:${
      param.from.location.col
    } ${getCellInfo(param.from)},===>row:${param.to.location.row} col:${
      param.to.location.col
    } ${getCellInfo(param.to)}`
  )
}

function getCellInfo(cell: Cell) {
  return `${
    (
      (cell.tagInfo && cell.tagInfo.attribute && cell.tagInfo.attribute.SB) ||
      ''
    ).substr(0, 8) + (cell.value || '空')
  }`
}
