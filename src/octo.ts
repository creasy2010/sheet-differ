export type Span = {
  col: number
  row: number
  colCount: number
  rowCount: number
}


export type CellDTO = {
  value?: string | number
  formula?: string
  style?: {
    hAlign?: number
    backColor?: string
    wordWrap?: boolean
    imeMode?: number
    themeFont?: string
    locked?: boolean
    textIndent?: number
    foreColor?: string
    vAlign?: number
    font?: string
    borderLeft?:{
      color:string;
      style:1
    }
    [key: string]: unknown
  }
  tag?: string;
  // cellId?: string
}


export type DataTable = {
  [key: string]: {
    [key: string]: CellDTO
  }
}

export type Sheet = {
  name?: string
  tag?: string
  theme?: string
  data: {
    dataTable: DataTable
  }
  spans?: Span[]
}

export type Sheets = {
  [name: string]: Sheet
}

export type TemplateMap = {
  sheetCount: number
  sheets: Sheets
  taskgroup: string
  backColor: string
  version: string
  namedStyles: { [key: string]: boolean | number | string }[]
  activeSheetIndex?: number
  tabStripRatio?: number
}

export type Tag = {
  backFormula: string
  attribute: {
    SB: string
    FK: string
    SWCSH: string
  }
  frontFormula: string | null
}

