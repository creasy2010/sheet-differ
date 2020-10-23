import { Cell, DataTable } from './octo'

export type DiffKey = string | number | symbol | null | bigint
export type Change =
  | {
      type: 'insert'
      key: DiffKey
      after: DiffKey
      index: number
    }
  | {
      type: 'movea' // move after
      key: DiffKey
      after: DiffKey
      index: number
    }
  | {
      type: 'moveb' // move before
      key: DiffKey
      before: DiffKey
      index: number
    }
  | {
      type: 'remove'
      key: DiffKey
      index: number
    }

const nul = Symbol(0)

export function listKeyDiff(oldList: DiffKey[], newList: DiffKey[]): Change[] {
  let oldHead = 0
  let newHead = 0
  let oldTail = oldList.length - 1
  let newTail = newList.length - 1
  let lastHead: DiffKey | null = null
  let lastTail: DiffKey | null = null
  const res: Change[] = []

  while (oldHead < oldTail && newHead < newTail) {
    if (oldList[oldHead] === nul) {
      oldHead++
    } else if (oldList[oldTail] === nul) {
      oldTail--
    } else if (newList[newHead] === oldList[oldHead]) {
      lastHead = newList[newHead]
      newHead++
      oldHead++
    } else if (newList[newHead] === oldList[oldTail]) {
      res.push({
        type: 'movea',
        key: oldList[oldTail],
        after: lastHead,
        index: oldTail
      })
      lastHead = oldList[oldTail]
      newHead++
      oldTail--
    } else if (newList[newTail] === oldList[oldTail]) {
      lastTail = oldList[oldTail]
      oldTail--
      newTail--
    } else if (newList[newTail] === oldList[oldHead]) {
      res.push({
        type: 'moveb',
        key: oldList[oldHead],
        before: lastTail,
        index: oldHead
      })
      lastTail = oldList[oldHead]
      newTail--
      oldHead++
    } else {
      const headIndex = oldList.indexOf(newList[newHead])
      if (~headIndex) {
        res.push({
          type: 'movea',
          key: newList[newHead],
          after: lastHead,
          index: oldHead
        })
        oldList[headIndex] = nul
      } else {
        res.push({
          type: 'insert',
          key: newList[newHead],
          after: lastHead,
          index: oldHead
        })
      }
      lastHead = newList[newHead]
      newHead++

      if (!newList.includes(oldList[oldTail])) {
        res.push({ type: 'remove', key: oldList[oldTail], index: oldTail })
        oldTail--
      }
    }
  }
  if (newHead <= newTail) {
    for (; newHead <= newTail; newHead++) {
      if (!oldList.includes(newList[newHead])) {
        res.push({
          type: 'insert',
          key: newList[newHead],
          after: lastHead,
          index: newHead
        })
      }
      lastHead = newList[newHead]
    }
  }
  if (oldHead <= oldTail) {
    for (; oldHead <= oldTail; oldHead++) {
      if (oldList[oldHead] !== nul) {
        if (!newList.includes(oldList[oldHead])) {
          res.push({ type: 'remove', key: oldList[oldHead], index: oldHead })
        }
      }
    }
  }
  return res
}

export const hashify = (str?: string | number) =>
  str === undefined
    ? 0n
    : BigInt(
        [...String(str)].reduce((a, b) => {
          a = (a << 5) - a + b.charCodeAt(0)
          return a & a
        }, 0)
      )

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

export const getCellSb = (cell: Cell): string | undefined => {
  if (cell.tag) {
    const tag = JSON.parse(cell.tag)
    if ('attribute' in tag) {
      return JSON.parse(tag.attribute).SB
    }
  }
  return undefined
}

export const Data2Array = (
  dataTable: DataTable,
  direction: 'row' | 'column' = 'row'
): { cells: unknown[][] } => {
  const entries = Object.entries(dataTable)

  const res: unknown[][] = new Array(entries.length)
    .fill(undefined)
    .map(() => [])
  // console.log(entries)
  entries.forEach(([rowIndex, row]) => {
    // console.log(row)
    for (const columnIndex in row) {
      if (direction === 'row') {
        res[+rowIndex][+columnIndex] = String(
          row[columnIndex].value ?? row[columnIndex].formula ?? ''
        )
      } else {
        res[+columnIndex][+rowIndex] = row[columnIndex]
      }
    }
  })
  return { cells: res }
}

