import { Cell, getCellSb } from './octo'

export type RowState = 'modify' | 'insert' | 'remove'

export const diff = (oldCellGrid: Cell[][], newCellGrid: Cell[][]) => {
  const res = new Map<[number, number], RowState>()

  for (let i = 0; i < newCellGrid.length; i++) {
    const oldRowCells = oldCellGrid[i]
    const newRowCells = newCellGrid[i]

    let rowState: RowState = 'modify'

    for (let j = 0; j < oldRowCells.length; j++) {
      const oldCell = oldRowCells[j]
      const newCell = newRowCells[j]

      if (isCellEqual(oldCell, newCell)) {
        rowState = 'modify'
        break
      }

      const oldRight = oldRowCells[j]
      const newRight = oldRowCells[j]

      if (isCellEqual(oldRight, newRight)) {
        res.set([i, j], rowState)
      }
    }
  }
}

export const isCellEqual = (cellA: Cell, cellB: Cell): boolean => {
  const sbA = getCellSb(cellA)
  const sbB = getCellSb(cellB)
  if (sbA === sbB) {
    return true
  }

  if (cellA.value === cellB.value) {
    if (cellA.formula !== cellB.formula) {
      return false
    }
    return true
  }

  return false
}
