import { Cell } from './octo'
import { isCellEqual } from './utils'

// export const checkSimilarity = (
//   oldCells: Cell[],
//   newCells: Cell[]
// ): [Change[], boolean] => {
//   const changes = [] as Change[]
//   return [
//     changes,
//     changes.filter((c) => c.type !== 'movea' && c.type !== 'moveb').length /
//       oldCells.length <
//       0.5
//   ]
// }


export const checkCellsSimilarity = (
  cellsA: Cell[],
  cellsB: Cell[],
  threshold = 2
) => {
  let count = 0
  cellsA.forEach((cell) => {
    if (cellsB.find((v) => isCellEqual(v, cell))) {
      count++
    }
  })
}