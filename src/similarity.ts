import { Cell, DataTable } from './octo'
import { Change, listKeyDiff } from './utils'

export const checkSimilarity = (
  oldCells: Cell[],
  newCells: Cell[]
): [Change[], boolean] => {
  const changes = [] as Change[]
  return [
    changes,
    changes.filter((c) => c.type !== 'movea' && c.type !== 'moveb').length /
      oldCells.length <
      0.5
  ]
}

