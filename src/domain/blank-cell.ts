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
import Cell from './cell'

export default class BlankCell extends Cell {
  constructor(public cellData: CellDTO, ownedSheet: Sheet) {
    super(cellData, ownedSheet)
  }
}
