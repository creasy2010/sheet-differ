import { Sheet, Cell, DataTable } from './octo'
import { Change, hashify, listKeyDiff } from './utils'

export const Data2Array = (
  dataTable: DataTable,
  direction: 'row' | 'column' = 'row'
): { cells: unknown[][] } => {

  const entries = Object.entries(dataTable)

  const res: unknown[][] = new Array(entries.length).fill(undefined).map(() => [])
  // console.log(entries)
  entries.forEach(([rowIndex, row]) => {
    // console.log(row)
    for (const columnIndex in row) {
      if (direction === 'row') {
        res[+rowIndex][+columnIndex] = String(row[columnIndex].value ?? row[columnIndex].formula ?? '')
      } else {
        res[+columnIndex][+rowIndex] = row[columnIndex]
      }
    }
  })
  return { cells: res }
}

// export const flatternSheet = (dataTable: DataTable) => {
//   const entries = Object.entries(dataTable)

//   const res: Cell[] = []
//   entries.forEach(([_rowIndex, row]) =>
//     Object.entries(row).forEach(([_columnIndex, cell]) => res.push(cell))
//   )

//   return res
// }

export const isCellEqual = (cellA: Cell, cellB: Cell) =>
  getCellHash(cellA) === getCellHash(cellB)

export const getCellHash = (cell: unknown) => {
  return hashify(cell)
}

export const getCellGroupValue = (cells: bigint[]): bigint => {
  return cells.reduce((acc, cur) => {
    const v = getCellHash(cur)
    acc += v
    return acc
  }, 0n)
}

export const isCellGroupEqual = (cellsA: Cell[], cellsB: Cell[]) =>
  getCellGroupValue(cellsA) === getCellGroupValue(cellsB)

export const diffSheetRows = (sheetA: Sheet, sheetB: Sheet) => {
  const arrAR = Data2Array(sheetA.data.dataTable)
  const arrBR = Data2Array(sheetB.data.dataTable)
  console.log(arrAR)
  console.log(arrBR)
  const keysAR = arrAR.cells.map((cells) => getCellGroupValue(cells))
  const keysBR = arrBR.cells.map((cells) => getCellGroupValue(cells))

  const arrAC = Data2Array(sheetA.data.dataTable, 'column')
  const arrBC = Data2Array(sheetB.data.dataTable, 'column')
  console.log(arrAC)
  console.log(arrBC)
  const keysAC = arrAC.cells.map((cells) => getCellGroupValue(cells))
  const keysBC = arrBC.cells.map((cells) => getCellGroupValue(cells))

  console.log(keysAR)
  console.log(keysBR)
  console.log(keysAC)
  console.log(keysBC)

  const rowChanges = listKeyDiff(keysAR, keysBR)
  const columnChanges = listKeyDiff(keysAC, keysBC)
  console.log(rowChanges)

  let last: Change | undefined
  const rowRes: Change[] = []

  for (let i = 0; i < rowChanges.length; i++) {
    const change = rowChanges[i]
    if (last) {
      if (change.type === 'movea') {
        if (change.after !== last?.key) {
          rowRes.push(change)
        }
      } else {
        rowRes.push(change)
      }
    }
    last = change
  }
  console.log(rowRes)
  console.log(columnChanges)

  // rowChanges.forEach((change) => {
  //   const { index } = change
  //   console.log()
  // })
}

export const diffInCells = (cellsA: Cell[], cellsB: Cell[]) => {
  const keysA = cellsA.map((cell) => getCellHash(cell))
  const keysB = cellsB.map((cell) => getCellHash(cell))

  return listKeyDiff(keysA, keysB)
}
