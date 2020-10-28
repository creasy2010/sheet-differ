/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/
import { CellDTO } from '../octo'
import Sheet from './sheet'

export default class Cell {
  tagInfo?: TagInfo = undefined

  /**
   * 单元格的连接信息;
   */
  cellLink: {
    top?: Cell
    left?: Cell
    right?: Cell
    bottom?: Cell
  } = {}

  ownedSheet: Sheet

  constructor(
    public cellData: CellDTO,
    public location?: {
      col: number
      row: number
      width: number
      height: number
    }
  ) {}

  get tag(): TagInfo | undefined {
    if (!this.cellData.tag) {
      return
    }
    if (!this.tagInfo) {
      this.tagInfo = JSON.parse(this.cellData.tag)
      if (typeof this.tagInfo.attribute === 'string') {
        this.tagInfo.attribute = JSON.parse(this.tagInfo.attribute)
      }
    }
    return this.tagInfo
  }

  /**
   * 是否是计算单元格;
   */
  get isFormulaCell(): boolean {
    return !!(this.tag && this.tag.attribute && this.tag.attribute.SB)
    // TODO dong 2020/10/28 ts配置要处理下.
    // return !!this.tag?.attribute?.SB
    // return false
  }

  /**
   * sb属性是否一致;
   *
   *
   *
   * @param toCell
   */
  isEqual(toCell: Cell) {}
}

interface TagInfo {
  backFormula?: string
  frontFormula?: string
  attribute?: {
    SB?: string
    SWCSH?: string
    FK?: string
  }
  [key: string]: any
}
