/**
 * @desc
 *
 * @使用场景
 *
 * @coder.yang2010@gmail.com
 * @Date    2020/10/27
 **/
import {CellDTO} from '../octo'

export default class Cell {
  tagInfo?: TagInfo = undefined

  constructor(
    public cellData: CellDTO,
    public location?: {x: number; y: number; width: number; height: number},
  ) {}

  get tag(): TagInfo | undefined {
    if (!this.cellData.tag) {
      return
    }
    if (!this.tagInfo) {
      this.tagInfo = JSON.parse(this.cellData.tag)
    }
    return this.tagInfo
  }

  /**
   * 是否是计算单元格;
   */
  get isFormulaCell(): boolean {
    return !!this.tag?.attribute?.SB
  }

  /**
   * sb属性是否一致;
   *
   *
   *
   * @param toCell
   */
  isEqual(toCell: Cell) {

  }
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
